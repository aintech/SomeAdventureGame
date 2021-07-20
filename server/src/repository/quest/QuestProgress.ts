import query, { defaultMapper, single } from "../Db";
import { HeroWithItems } from "../hero/Hero";
import { Quest } from "../quest/Quest";
import { generateCheckpoints, persistQuestCheckpoints, QuestCheckpoint } from "../quest/QuestCheckpoints";

type QuestProgress = {
  id: number;
  userId: number;
  questId: number;
  embarkedTime: Date;
  completed: boolean;
  duration: number;
};

const persistProgress = (userId: number, questId: number, checkpoints: QuestCheckpoint[]) => {
  const checkpointsDuration = checkpoints.map((c) => c.duration).reduce((a, b) => a + b);

  return query<number>(
    "persistProgress",
    `with quest_duration as (select duration as d from public.quest where id = $2)
     insert into public.quest_progress 
     (user_id, quest_id, duration, embarked_time) 
     values ($1, $2, (select d from quest_duration) + $3, now()) 
     returning id`,
    [userId, questId, checkpointsDuration],
    defaultMapper,
    (res: { id: number }[]) => res[0].id
  );
};

export const createQuestProgress = async (userId: number, quest: Quest, heroes: HeroWithItems[]) => {
  const checkpoints = await generateCheckpoints(quest, heroes);
  const progressId = await persistProgress(userId, quest.id, checkpoints);
  await persistQuestCheckpoints(progressId, checkpoints);
  return progressId;
};

export const getQuestProgress = (userId: number, questId: number) => {
  return query<QuestProgress>(
    "getQuestProgress",
    `select * from public.quest_progress where user_id = $1 and quest_id = $2`,
    [userId, questId],
    mapQuestProgress,
    single
  );
};

export const deleteProgress = (userId: number, questId: number) => {
  return query<void>("deleteProgress", "delete from public.quest_progress where user_id = $1 and quest_id = $2", [
    userId,
    questId,
  ]);
};

export const completeProgress = (userId: number, questId: number) => {
  return query<void>(
    "completeProgress",
    `update public.quest_progress 
     set completed = true 
     where user_id = $1 and quest_id = $2`,
    [userId, questId]
  );
};

type QuestProgressRow = {
  id: string;
  user_id: string;
  quest_id: string;
  embarked_time: Date;
  completed: boolean;
  duration: string;
};

const mapQuestProgress = (row: QuestProgressRow) => {
  return {
    id: +row.id,
    userId: +row.user_id,
    questId: +row.quest_id,
    embarkedTime: row.embarked_time,
    completed: row.completed,
    duration: +row.duration,
  };
};
