import { CheckpointPassedBody } from '../../routes/QuestRoutes';
import query, { single } from '../Db';
import { adjustGoldExperience, adjustHealth, HeroWithSkills } from '../hero/Hero';
import { adjustItems } from '../Item';
import { Monster } from '../Monster';
import { getQuestProgress } from './QuestProgress';

export enum CheckpointType {
  BATTLE,
  TREASURE,
}

export type QuestCheckpoint = {
  id?: number /** empty when checkpoint not persist yet */;
  type: CheckpointType;
  occuredAt: number;
  passed: boolean;
  treasure?: number;
  enemies?: Monster[];
};

export type CheckpointReward = {
  checkpointId: number;
  rewards: { heroId: number; gold: number; experience: number }[];
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
          ${checkpoint.enemies ? `'${JSON.stringify(checkpoint.enemies)}'` : null},
          ${checkpoint.treasure},
          ${checkpoint.passed}`
    )
    .join(' union ');

  await query<void>(
    'persistQuestCheckpoints',
    `insert into public.quest_checkpoint 
     (quest_progress_id, type, occured_at, enemies, treasure, passed)
     select * from (${checkpointsData}) as vals`
  );

  return getQuestCheckpoints([progressId]);
};

export const getQuestCheckpoint = async (checkpointId: number) => {
  return query<QuestCheckpointWithProgress>(
    'getQuestCheckpoint',
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
    'getQuestCheckpoints',
    `select 
          checkpoint.*, 
          progress.quest_id,
          progress.embarked_time 
     from public.quest_checkpoint checkpoint
     left join quest_progress progress on progress.id = checkpoint.quest_progress_id
     where quest_progress_id in (${progressIds.join(',')})`,
    [],
    mapQuestCheckpointWithProgress
  );

  return checkpoints;
};

export const getQuestCheckpointsByQuest = async (userId: number, questId: number) => {
  const progress = await getQuestProgress(userId, questId);
  return getQuestCheckpoints([progress.id]);
};

export const checkpointPassed = async (checkpoint: QuestCheckpointWithProgress, heroes: HeroWithSkills[], result: CheckpointPassedBody) => {
  if (checkpoint.passed) {
    return;
  }

  const adjustments: Promise<any>[] = [];

  let gold = checkpoint.treasure ?? 0;
  let experience = 0;

  if (checkpoint.enemies) {
    gold += checkpoint.enemies.reduce((g, e) => g + e.loot.gold, 0);
    experience = checkpoint.enemies.reduce((a, b) => a + b.experience, 0);
  }

  const goldPerHero = gold > 0 ? Math.ceil(gold / heroes.length) : 0;
  const experiencePerHero = experience > 0 ? Math.ceil(experience / heroes.length) : 0;

  if (result.events) {
    heroes.forEach((h) => {
      const events = result.events!.find((e) => e.heroId === h.id)?.events;
      if (events) {
        let hpAdjust = 0;
        events
          .sort((a, b) => a.time - b.time)
          .forEach((e) => {
            hpAdjust += e.hpAlter ?? 0;
          });

        const usedItems: Map<number, number> = new Map();
        events
          .filter((e) => e.itemId)
          .forEach((e) => {
            usedItems.set(e.itemId!, (usedItems.get(e.itemId!) ?? 0) - 1);
          });

        usedItems.forEach((amount, itemId) => {
          adjustments.push(adjustItems(h.id, itemId, amount));
        });

        adjustments.push(adjustHealth(h.id, hpAdjust));
      }
    });
  }

  heroes.forEach((h) => {
    adjustments.push(adjustGoldExperience(h.id, goldPerHero, experiencePerHero));
  });

  if (adjustments.length > 0) {
    await Promise.all(adjustments);
  }

  await markAsPassed(checkpoint.id!);

  const reward: CheckpointReward = { checkpointId: checkpoint.id!, rewards: [] };
  heroes.forEach((h) => reward.rewards.push({ heroId: h.id, gold: goldPerHero, experience: experiencePerHero }));

  return reward;
};

const markAsPassed = (checkpointId: number) => {
  return query<void>('markAsPassed', `update public.quest_checkpoint set passed = true where id = $1`, [checkpointId]);
};

export const deleteCheckpoints = (progressId: number) => {
  return query<void>(
    'deleteCheckpoint',
    `delete from public.quest_checkpoint 
     where quest_progress_id = $1`,
    [progressId]
  );
};

type CheckpointWithProgressRow = {
  id: string;
  type: string;
  occured_at: string;
  enemies: string | null;
  passed: boolean;
  treasure: string;
  quest_progress_id: string;
  quest_id: string;
  embarked_time: Date;
};

const mapQuestCheckpointWithProgress = (row: CheckpointWithProgressRow): QuestCheckpointWithProgress => {
  return {
    id: +row.id,
    type: mapCheckpointType(row.type),
    occuredAt: +row.occured_at,
    enemies: mapEnemies(row.enemies),
    passed: row.passed,
    treasure: +row.treasure,
    progressId: +row.quest_progress_id,
    questId: +row.quest_id,
    embarkedTime: row.embarked_time,
  };
};

const mapCheckpointType = (type: string) => {
  switch (type) {
    case 'treasure':
      return CheckpointType.TREASURE;
    case 'battle':
      return CheckpointType.BATTLE;
    default:
      throw new Error(`Unknown checkpoint type ${type}`);
  }
};

const mapEnemies = (enemies: string | null) => {
  if (!enemies) {
    return undefined;
  }
  return JSON.parse(enemies) as Monster[];
};
