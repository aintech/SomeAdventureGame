import { BattleRound } from "../../generators/BattleGenerator";
import { CheckpointPassedBody } from "../../routes/QuestRoutes";
import query, { single } from "../Db";
import { adjustGoldExperience, adjustHealth, HeroWithSkills } from "../hero/Hero";
import { Monster } from "../Monster";
import { getQuestProgress } from "./QuestProgress";

export enum CheckpointType {
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

export const getQuestCheckpoints = async (progressIds: number[]) => {
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

  return checkpoints;
};

export const getQuestCheckpointsByQuest = async (userId: number, questId: number) => {
  const progress = await getQuestProgress(userId, questId);
  return getQuestCheckpoints([progress.id]);
};

export const checkpointPassed = async (
  checkpoint: QuestCheckpointWithProgress,
  heroes: HeroWithSkills[],
  result: CheckpointPassedBody
) => {
  if (checkpoint.passed) {
    return;
  }

  const adjustments: Promise<any>[] = [];

  // if (checkpoint.type === CheckpointType.BATTLE) {
  //   // const adjustments: Promise<any>[] = [];
  //   // // const rounds = checkpoint.rounds!;
  //   // const heroesHP = await getHeroesHP(checkpoint.questId);
  //   // const healthValues = new Map<number, number>();
  //   // const usedItems = new Map<{ heroId: number; itemId: number }, number>();
  //   // heroesHP.forEach((h) => {
  //   //   healthValues.set(h.id, h.health);
  //   // });
  //   // const maxSec = Math.max(...Array.from(rounds.keys()));
  //   // for (let sec = 0; sec <= maxSec; sec++) {
  //   //   const process = rounds.get(sec);
  //   //   if (!process) {
  //   //     continue;
  //   //   }
  //   //   for (const round of process) {
  //   //     if (round.action === BattleActionType.ENEMY_ATTACK) {
  //   //       healthValues.set(round.heroId, healthValues.get(round.heroId)! - +round.hpAdjust!);
  //   //     }
  //   //     if (round.action === BattleActionType.USE_POTION) {
  //   //       const key = { heroId: round.heroId, itemId: round.itemId! };
  //   //       usedItems.set(key, (usedItems.get(key) ?? 0) - 1);
  //   //       healthValues.set(round.heroId, healthValues.get(round.heroId)! + +round.hpAdjust!);
  //   //     }
  //   //   }
  //   // }
  //   // healthValues.forEach((v, k) => adjustments.push(setHeroHealth(k, v)));
  //   // usedItems.forEach((v, k) => adjustments.push(adjustItems(k.heroId, k.itemId, v)));
  //   // if (adjustments.length > 0) {
  //   //   await Promise.all(adjustments);
  //   // }
  // } else if (checkpoint.type === CheckpointType.TREASURE) {
  //   //do nothing
  // } else {
  //   throw new Error(`Unknown checkpoint type! ${checkpoint}`);
  // }

  let gold = 0;
  let experience = 0;
  if (checkpoint.enemies) {
    let collectedGold = 0;
    result.collected.forEach((drop) => {
      const enemy = checkpoint.enemies!.find((e) => e.actorId === drop.actorId)!;
      enemy.drop.forEach((d) => {
        if (drop.drops.includes(d.fraction)) {
          collectedGold += d.gold;
        }
      });
    });

    gold = Math.ceil((collectedGold + checkpoint.tribute) / heroes.length);
    experience = Math.ceil(checkpoint.enemies.reduce((a, b) => a + b.experience, 0) / heroes.length);
  }

  heroes.forEach((h) => {
    const events = result.events.find((e) => e.heroId === h.id)?.events;
    if (events) {
      let hpAdjust = 0;
      events
        .sort((a, b) => a.time - b.time)
        .forEach((e) => {
          hpAdjust += e.hpAlter ?? 0;
        });

      adjustments.push(adjustHealth(h.id, hpAdjust));
    }
  });

  heroes.forEach((h) => {
    adjustments.push(adjustGoldExperience(h.id, gold, experience));
  });

  if (adjustments.length > 0) {
    await Promise.all(adjustments);
  }

  await markAsPassed(checkpoint.id!);
};

const markAsPassed = (checkpointId: number) => {
  return query<void>("markAsPassed", `update public.quest_checkpoint set passed = true where id = $1`, [checkpointId]);
};

export const deleteCheckpoints = (progressId: number) => {
  return query<void>(
    "deleteCheckpoint",
    `delete from public.quest_checkpoint 
     where quest_progress_id = $1`,
    [progressId]
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
