import { generateCheckpoints, linkCheckpoints } from '../../generators/CheckpointGenerator';
import query, { defaultMapper, single } from '../Db';
import { HeroWithItems, HeroWithSkills } from '../hero/Hero';
import { Quest } from '../quest/Quest';
import { getQuestCheckpoints, persistLinks, persistQuestCheckpoints, QuestCheckpoint } from './QuestCheckpoint';

type QuestProgress = {
  id: number;
  userId: number;
  questId: number;
  embarkedTime: Date;
  completed: boolean;
};

const persistProgress = (userId: number, questId: number, checkpoints: QuestCheckpoint[]) => {
  return query<number>(
    'persistProgress',
    `with quest_time as (select travel_time tt from public.quest where id = $2)
     insert into public.quest_progress 
     (user_id, quest_id, embarked_time) 
     values ($1, $2, (now() + ((select tt from quest_time) * interval '1 second'))) 
     returning id`,
    [userId, questId],
    defaultMapper,
    (res: { id: number }[]) => res[0].id
  );
};

export const createQuestProgress = async (userId: number, quest: Quest, heroes: HeroWithSkills[]) => {
  const generated = await generateCheckpoints(quest, heroes);

  const progressId = await persistProgress(userId, quest.id, generated);

  const persisted = await persistQuestCheckpoints(progressId, generated);

  const links = linkCheckpoints(persisted);

  await persistLinks(links);

  return progressId;
};

export const getQuestProgress = (userId: number, questId: number) => {
  return query<QuestProgress>(
    'getQuestProgress',
    `select * from public.quest_progress where user_id = $1 and quest_id = $2`,
    [userId, questId],
    mapQuestProgress,
    single
  );
};

export const deleteProgress = (progressId: number) => {
  return query<void>('deleteProgress', 'delete from public.quest_progress where id = $1', [progressId]);
};

export const completeProgress = (progressId: number) => {
  return query<void>(
    'completeProgress',
    `update public.quest_progress 
     set completed = true 
     where id = $1`,
    [progressId]
  );
};

type QuestProgressRow = {
  id: string;
  user_id: string;
  quest_id: string;
  embarked_time: Date;
  completed: boolean;
};

const mapQuestProgress = (row: QuestProgressRow) => {
  return {
    id: +row.id,
    userId: +row.user_id,
    questId: +row.quest_id,
    embarkedTime: row.embarked_time,
    completed: row.completed,
  };
};
