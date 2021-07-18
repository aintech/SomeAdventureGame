import getBattleSteps, { BattleStep, BattleStepActionType } from "../battle/BattleProcessor";
import query, { single } from "./Db";
import { getHeroesHP, HeroWithItems, setHeroHealth } from "./Hero";
import { adjustItemsById } from "./Item";
import { getMonsterParty, Monster } from "./Monster";
import { Quest } from "./Quest";
import { getQuestProgress } from "./QuestProgress";

enum CheckpointType {
  TREASURE,
  BATTLE,
}

export type QuestCheckpoint = {
  id: number | null /** null when checkpoint not persist yet */;
  quest_progress_id: number | null /** null when progress not persist yet */;
  type: CheckpointType;
  occured_at: number;
  duration: number;
  passed: boolean;
  tribute: number;
  steps: Map<number, BattleStep[]> | null;
  enemies: Monster[] | null;
};

export type QuestCheckpointWithProgress = QuestCheckpoint & {
  quest_id: number;
  embarked_time: Date;
};

const generateCheckpoints = async (quest: Quest, heroes: HeroWithItems[]) => {
  const checkpoints: QuestCheckpoint[] = [];

  const checkpointsCount = 1; //Math.floor(quest.duration * 0.5 * 0.1);

  let checkpointsDuration = 0;
  for (let i = 0; i < checkpointsCount; i++) {
    const type = i % 2 == 0 ? CheckpointType.BATTLE : CheckpointType.TREASURE; //Math.random() > 1 ? "treasure" : "battle";

    const checkpointTime = i * 10;
    //пока чекпоинты начинаются с первой десятой части квеста
    const addSec = 5 + checkpointTime + checkpointsDuration;
    // Math.floor(quest.duration * 0.1) * 1000 + periodBetweenCheckpoints;
    // Math.floor(questDuration * 0.5) +
    // i * Math.floor(Math.random() * 10) * 1000;

    const occured_at = addSec;

    let tribute: number;
    let duration: number;
    let steps: Map<number, BattleStep[]> | null = null;
    let enemies: Monster[] | null = null;
    switch (type) {
      case CheckpointType.TREASURE:
        tribute = quest.level * Math.floor(Math.random() * 20 + 10);
        duration = 10;
        break;
      case CheckpointType.BATTLE:
        const monsters = await getMonsterParty(quest.level);
        steps = getBattleSteps(monsters, heroes);
        tribute = quest.level * Math.floor(Math.random() * 5 + 5);
        enemies = [...monsters];
        duration = Math.max(...Array.from(steps.keys()));
        break;
      default:
        throw new Error(`Unknown checkpoint type ${CheckpointType[type]}`);
    }

    checkpointsDuration += duration;

    checkpoints.push({
      type,
      occured_at,
      duration,
      steps,
      enemies,
      tribute,
      id: null,
      quest_progress_id: null,
      passed: false,
    });
  }

  return checkpoints;
};

const persistQuestCheckpoints = async (progressId: number, checkpoints: QuestCheckpoint[]) => {
  await query<void>(
    "persistQuestCheckpoints",
    checkpoints
      .map(
        (c) =>
          `insert into public.quest_checkpoint 
           (quest_progress_id, type, occured_at, duration, steps, enemies, tribute, passed)
           values
           (
            ${progressId},
            '${CheckpointType[c.type].toLowerCase()}', 
            ${c.occured_at}, 
            ${c.duration},
            ${c.steps ? `'${JSON.stringify(Array.from(c.steps.entries()))}'` : null},
            '${c.enemies ? JSON.stringify(c.enemies) : null}',
            '${c.tribute}',
            ${c.passed}
           );
          `
      )
      .join(" ")
  );

  return getQuestCheckpoints([progressId]);
};

//TODO: конверсия steps в объект
const getQuestCheckpoint = async (checkpointId: number) => {
  return query<QuestCheckpointWithProgress>(
    "getQuestCheckpoints",
    `select 
          checkpoint.*, 
          progress.quest_id,
          progress.embarked_time 
     from public.quest_checkpoint checkpoint
     left join quest_progress progress on progress.id = checkpoint.quest_progress_id
     where checkpoint.id = $1`,
    [checkpointId],
    single
  );
};

const getQuestCheckpoints = async (progressIds: number[], checkIfPassed = false) => {
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
     where quest_progress_id in (${progressIds.join(",")})`
  );

  if (checkIfPassed) {
    checkIfCheckpointPassed(checkpoints);
  }

  return checkpoints;
};

const getQuestCheckpointsByQuest = async (userId: number, questId: number) => {
  const progress = await getQuestProgress(userId, questId);
  return getQuestCheckpoints([progress.id]);
};

const checkIfCheckpointPassed = async (checkpoints: QuestCheckpointWithProgress[]) => {
  for (const checkpoint of checkpoints) {
    if (checkpoint.passed) {
      continue;
    }

    const endedIn =
      new Date(checkpoint.embarked_time).getTime() + +checkpoint.occured_at * 1000 + +checkpoint.duration * 1000;

    if (endedIn <= new Date().getTime()) {
      await checkpointPassed(checkpoint);
      checkpoint.passed = true;
    }
  }
};

const checkpointPassed = async (checkpoint: QuestCheckpointWithProgress) => {
  if (checkpoint.passed) {
    return;
  }

  if (checkpoint.type === CheckpointType.BATTLE) {
    const adjustments: Promise<any>[] = [];

    // const outcome = JSON.parse(checkpoint.outcome);
    const steps = checkpoint.steps!;
    const heroesHP = await getHeroesHP(checkpoint.quest_id);
    const healthValues = new Map<number, number>();
    const totalHPs = new Map<number, number>();
    const usedItems = new Map<number, number>();

    heroesHP.forEach((h) => {
      healthValues.set(h.id, h.health);
      totalHPs.set(h.id, h.total);
    });

    const maxSec = Math.max(...Array.from(steps.keys()));

    for (let sec = 0; sec <= maxSec; sec++) {
      const process = steps.get(sec); // steps.filter((o) => o[0] === sec);

      if (!process) {
        continue;
      }

      for (const step of process) {
        // const steps = action[1];
        // for (const step of steps) {
        if (step.action === BattleStepActionType.ENEMY_ATTACK) {
          healthValues.set(step.heroId, healthValues.get(step.heroId)! - +step.damage!);
        }
        if (step.action === BattleStepActionType.USE_POTION) {
          usedItems.set(step.itemId!, (usedItems.get(step.itemId!) ?? 0) - 1);
          healthValues.set(step.heroId, totalHPs.get(step.heroId)!);
        }
        // }
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

const deleteCheckpoints = (userId: number, questId: number) => {
  return query<void>(
    "deleteCheckpoint",
    `delete from public.quest_checkpoint 
     where quest_progress_id = 
     (select id from public.quest_progress where user_id = $1 and quest_id = $2)`,
    [userId, questId]
  );
};

export {
  generateCheckpoints,
  persistQuestCheckpoints,
  getQuestCheckpoint,
  getQuestCheckpoints,
  getQuestCheckpointsByQuest,
  checkpointPassed,
  deleteCheckpoints,
};
