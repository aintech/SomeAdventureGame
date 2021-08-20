import getBattleRounds, { BattleRound, BattleActionType } from "../../battle/BattleProcessor";
import query, { single } from "../Db";
import { getHeroesHP, HeroWithItems, HeroWithSkills, setHeroHealth } from "../hero/Hero";
import { adjustItemsById } from "../Item";
import { getMonsterParty, Monster } from "../Monster";
import { Quest } from "./Quest";
import { getQuestProgress } from "./QuestProgress";

enum CheckpointType {
  TREASURE,
  BATTLE,
}

export type QuestCheckpoint = {
  id?: number /** empty when checkpoint not persist yet */;
  type: CheckpointType;
  occuredAt: number;
  duration: number;
  passed: boolean;
  tribute: number;
  rounds?: Map<number, BattleRound[]>;
  stringifiedRounds?: string /** rounds as Map are not sending properly through http, send them as string */;
  enemies?: Monster[];
};

export type QuestCheckpointWithProgress = QuestCheckpoint & {
  progressId?: number /** empty when progress not persist yet */;
  questId: number;
  embarkedTime: Date;
};

export const generateCheckpoints = async (quest: Quest, heroes: HeroWithSkills[]) => {
  const checkpoints: QuestCheckpoint[] = [];

  const checkpointsCount = 5; //Math.floor(quest.duration * 0.5 * 0.1);

  let checkpointsDuration = 0;
  for (let i = 0; i < checkpointsCount; i++) {
    const type = i % 2 == 0 ? CheckpointType.BATTLE : CheckpointType.TREASURE; //Math.random() > 1 ? "treasure" : "battle";

    const checkpointTime = i * 10;
    //пока чекпоинты начинаются с первой десятой части квеста
    const addSec = 5 + checkpointTime + checkpointsDuration;
    // Math.floor(quest.duration * 0.1) * 1000 + periodBetweenCheckpoints;
    // Math.floor(questDuration * 0.5) +
    // i * Math.floor(Math.random() * 10) * 1000;

    const occuredAt = addSec;

    let tribute: number;
    let duration: number;
    let rounds: Map<number, BattleRound[]> | undefined;
    let enemies: Monster[] | undefined;
    switch (type) {
      case CheckpointType.TREASURE:
        tribute = quest.level * Math.floor(Math.random() * 20 + 10);
        duration = 10;
        break;
      case CheckpointType.BATTLE:
        const monsters = await getMonsterParty(quest.level);
        rounds = getBattleRounds(monsters, heroes);
        tribute = quest.level * Math.floor(Math.random() * 5 + 5);
        enemies = [...monsters];
        duration = Math.max(...Array.from(rounds.keys()));
        break;
      default:
        throw new Error(`Unknown checkpoint type ${CheckpointType[type]}`);
    }

    checkpointsDuration += duration;

    checkpoints.push({
      type,
      occuredAt,
      duration,
      rounds,
      enemies,
      tribute,
      passed: false,
    });
  }

  return checkpoints;
};

export const persistQuestCheckpoints = async (progressId: number, checkpoints: QuestCheckpoint[]) => {
  const checkpointsData = checkpoints
    .map(
      (checkpoint) =>
        `select 
          ${progressId},
          '${CheckpointType[checkpoint.type].toLowerCase()}', 
          ${checkpoint.occuredAt}, 
          ${checkpoint.duration},
          ${checkpoint.rounds ? `'${stringifyRounds(checkpoint.rounds)}'` : null},
          ${checkpoint.enemies ? `'${JSON.stringify(checkpoint.enemies)}'` : null},
          ${checkpoint.tribute},
          ${checkpoint.passed}`
    )
    .join(" union ");

  await query<void>(
    "persistQuestCheckpoints",
    `insert into public.quest_checkpoint 
     (quest_progress_id, type, occured_at, duration, rounds, enemies, tribute, passed)
     select * from (${checkpointsData}) as vals`
  );

  return getQuestCheckpoints([progressId]);
};

export const getQuestCheckpoint = async (checkpointId: number) => {
  return query<QuestCheckpointWithProgress>(
    "getQuestCheckpoint",
    `select 
          checkpoint.*, 
          progress.quest_id,
          progress.embarked_time 
     from public.quest_checkpoint checkpoint
     left join quest_progress progress on progress.id = checkpoint.quest_progress_id
     where checkpoint.id = $1`,
    [checkpointId],
    mapQuestCheckpointWithProgress,
    single
  );
};

export const getQuestCheckpoints = async (progressIds: number[], checkIfPassed = false) => {
  if (progressIds.length === 0) {
    return [];
  }
  const checkpoints = await query<QuestCheckpointWithProgress[]>(
    "getQuestCheckpoints",
    `select 
          checkpoint.*, 
          progress.quest_id,
          progress.embarked_time 
     from public.quest_checkpoint checkpoint
     left join quest_progress progress on progress.id = checkpoint.quest_progress_id
     where quest_progress_id in (${progressIds.join(",")})`,
    [],
    mapQuestCheckpointWithProgress
  );

  if (checkIfPassed) {
    checkIfCheckpointPassed(checkpoints);
  }

  return checkpoints;
};

export const getQuestCheckpointsByQuest = async (userId: number, questId: number) => {
  const progress = await getQuestProgress(userId, questId);
  return getQuestCheckpoints([progress.id]);
};

//TODO: Скорее всего больше не пригодится, т.к. игрок будет сам проходить чекпоинты
const checkIfCheckpointPassed = async (checkpoints: QuestCheckpointWithProgress[]) => {
  for (const checkpoint of checkpoints) {
    if (checkpoint.passed) {
      continue;
    }

    const endedIn =
      new Date(checkpoint.embarkedTime).getTime() + +checkpoint.occuredAt * 1000 + +checkpoint.duration * 1000;

    if (endedIn <= new Date().getTime()) {
      await checkpointPassed(checkpoint);
      checkpoint.passed = true;
    }
  }
};

//TODO: Скорее всего больше не пригодится, т.к. игрок будет сам проходить чекпоинты
export const checkpointPassed = async (checkpoint: QuestCheckpointWithProgress) => {
  if (checkpoint.passed) {
    return;
  }

  if (checkpoint.type === CheckpointType.BATTLE) {
    const adjustments: Promise<any>[] = [];

    const rounds = checkpoint.rounds!;
    const heroesHP = await getHeroesHP(checkpoint.questId);
    const healthValues = new Map<number, number>();
    const totalHPs = new Map<number, number>();
    const usedItems = new Map<number, number>();

    heroesHP.forEach((h) => {
      healthValues.set(h.id, h.health);
      totalHPs.set(h.id, h.total);
    });

    const maxSec = Math.max(...Array.from(rounds.keys()));

    for (let sec = 0; sec <= maxSec; sec++) {
      const process = rounds.get(sec);

      if (!process) {
        continue;
      }

      for (const round of process) {
        if (round.action === BattleActionType.ENEMY_ATTACK) {
          healthValues.set(round.heroId, healthValues.get(round.heroId)! - +round.damage!);
        }
        if (round.action === BattleActionType.USE_POTION) {
          usedItems.set(round.itemId!, (usedItems.get(round.itemId!) ?? 0) - 1);
          healthValues.set(round.heroId, totalHPs.get(round.heroId)!);
        }
      }
    }

    if (adjustments.length > 0) {
      healthValues.forEach((v, k) => adjustments.push(setHeroHealth(k, v)));
      usedItems.forEach((v, k) => adjustments.push(adjustItemsById(k, v)));
      await Promise.all(adjustments);
    }
  } else if (checkpoint.type === CheckpointType.TREASURE) {
    //do nothing
  } else {
    throw new Error(`Unknown checkpoint type! ${checkpoint}`);
  }

  await markAsPassed(checkpoint.id!);
};

const markAsPassed = (checkpointId: number) => {
  return query<void>("markAsPassed", `update public.quest_checkpoint set passed = true where id = $1`, [checkpointId]);
};

export const deleteCheckpoints = (userId: number, questId: number) => {
  return query<void>(
    "deleteCheckpoint",
    `delete from public.quest_checkpoint 
     where quest_progress_id = 
     (select id from public.quest_progress where user_id = $1 and quest_id = $2)`,
    [userId, questId]
  );
};

type CheckpointWithProgressRow = {
  id: string;
  type: string;
  occured_at: string;
  duration: string;
  rounds: string | null;
  enemies: string | null;
  passed: boolean;
  tribute: string;
  quest_progress_id: string;
  quest_id: string;
  embarked_time: Date;
};

const mapQuestCheckpointWithProgress = (row: CheckpointWithProgressRow): QuestCheckpointWithProgress => {
  return {
    id: +row.id,
    type: mapCheckpointType(row.type),
    occuredAt: +row.occured_at,
    duration: +row.duration,
    rounds: mapRounds(row.rounds),
    stringifiedRounds: row.rounds ?? undefined,
    enemies: mapEnemies(row.enemies),
    passed: row.passed,
    tribute: +row.tribute,
    progressId: +row.quest_progress_id,
    questId: +row.quest_id,
    embarkedTime: row.embarked_time,
  };
};

const mapCheckpointType = (type: string) => {
  switch (type) {
    case "treasure":
      return CheckpointType.TREASURE;
    case "battle":
      return CheckpointType.BATTLE;
    default:
      throw new Error(`Unknown checkpoint type ${type}`);
  }
};

/** duplicate code in client */
const mapRounds = (rounds: string | null) => {
  if (!rounds) {
    return undefined;
  }
  const result: Map<number, BattleRound[]> = new Map();
  rounds.split(",\n").forEach((s) => {
    const roundToTime = s.split("::");
    result.set(+roundToTime[0], JSON.parse(roundToTime[1]));
  });
  return result;
};

const mapEnemies = (enemies: string | null) => {
  if (!enemies) {
    return undefined;
  }
  return JSON.parse(enemies) as Monster[];
};

const stringifyRounds = (rounds: Map<number, BattleRound[]>) => {
  let result = "";
  rounds.forEach((v, k) => {
    result += `${k}::${JSON.stringify(v)},\n`;
  });
  return result.slice(0, -2); /** removing last ,\n */
};
