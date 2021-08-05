import { GUILD_SHARE } from "../../utils/Variables";
import query from "../Db";
import { getHeroesByIds, getHeroesOnQuest, rewardHeroesForQuest } from "../hero/Hero";
import { HeroActivityType, updateHeroActivities } from "../hero/HeroActivity";
import { deleteCheckpoints, getQuestCheckpoints, QuestCheckpointWithProgress } from "./QuestCheckpoints";
import { completeProgress, createQuestProgress, deleteProgress } from "./QuestProgress";
import { addStats, getStats } from "../Stats";

export type Quest = {
  id: number;
  level: number;
  title: string;
  description: string;
  travelTime: number;
  duration: number;
  fame: number;
  tribute: number;
  experience: number;
};

export type QuestWithProgress = Quest & {
  progressId?: number;
  embarkedTime?: Date;
  progressDuration?: number;
  completed?: boolean;
};

export type QuestWithCheckpoints = QuestWithProgress & {
  checkpoints?: QuestCheckpointWithProgress[];
};

export const getQuestsByIds = async (userId: number, questIds: number[], withCheckpoints = true) => {
  const quests = await query<QuestWithProgress[]>(
    "getQuestsByIds",
    `select 
          quest.*, 
          progress.id as progress_id,
          progress.embarked_time, 
          progress.duration as progress_duration,
          progress.completed 
     from public.quest quest 
     left join public.quest_progress progress 
          on progress.quest_id = quest.id and progress.user_id = $1
     where quest.id in (${questIds.join(",")});`,
    [userId],
    mapQuestWithProgress
  );

  return withCheckpoints ? addCheckpoints(quests) : quests;
};

export const getQuests = async (userId: number) => {
  const quests = await query<QuestWithProgress[]>(
    "getQuests",
    `select 
            quest.*, 
            progress.id as progress_id, 
            progress.embarked_time, 
            progress.duration as progress_duration,
            progress.completed
     from public.quest quest
     left join public.quest_progress progress 
            on progress.quest_id = quest.id and progress.user_id = $1
     where 
     quest.id not in (select quest_id from public.quest_progress where user_id = $1) 
     or progress.completed = false;`,
    [userId],
    mapQuestWithProgress
  );

  return addCheckpoints(quests, true);
};

const addCheckpoints = async (quests: QuestWithProgress[], checkIfPassed = false) => {
  const progressIds = quests.filter((q) => q.progressId !== undefined).map((q) => q.progressId) as number[];
  const checkpoints = await getQuestCheckpoints(progressIds, checkIfPassed);

  const questWithCheckpoints: QuestWithCheckpoints[] = [];
  quests.forEach((q) =>
    questWithCheckpoints.push({
      ...q,
      checkpoints: checkpoints.filter((c) => c.progressId === q.progressId),
    })
  );
  return questWithCheckpoints;
};

export const embarkOnQuest = async (userId: number, questId: number, heroIds: number[]) => {
  const fetchedQuests = await getQuestsByIds(userId, [questId], false);
  const quest = fetchedQuests[0];
  const heroes = await getHeroesByIds(heroIds);

  await createQuestProgress(userId, quest, heroes);

  await updateHeroActivities(
    userId,
    heroIds.map((id) => {
      return {
        heroId: id,
        type: HeroActivityType.QUEST,
        activityId: questId,
        description: `Выполняет задание ${quest.title}`,
      };
    })
  );

  const embarkedQuests = await getQuestsByIds(userId, [questId]);
  const embarkedHeroes = await getHeroesByIds(heroIds);

  return Promise.resolve({ embarkedQuests, embarkedHeroes });
};

export const completeQuest = async (userId: number, questId: number, canceled = false) => {
  let quest = ((await getQuestsByIds(userId, [questId])) as QuestWithCheckpoints[])[0];
  const heroIds = (await getHeroesOnQuest(userId, questId)).map((h) => h.id);
  const queries: Promise<any>[] = [];

  if (canceled) {
    queries.push(deleteProgress(userId, questId));
  } else {
    const checkpointsTribute = quest.checkpoints!.map((c) => +c.tribute).reduce((a, b) => a + b, 0);
    const heroesTribute = Math.floor(quest.tribute * (1 - GUILD_SHARE)) + checkpointsTribute;
    const playerTribute = Math.floor(quest.tribute * GUILD_SHARE);

    queries.push(rewardHeroesForQuest(userId, heroIds, heroesTribute, quest.experience));
    queries.push(completeProgress(userId, questId));
    queries.push(addStats(userId, playerTribute, quest.fame));
  }

  queries.push(deleteCheckpoints(userId, questId));
  queries.push(
    updateHeroActivities(
      userId,
      heroIds.map((id) => {
        return {
          heroId: id,
          type: HeroActivityType.IDLE,
          description: "Не при делах",
        };
      })
    )
  );

  await Promise.all(queries);

  quest = ((await getQuestsByIds(userId, [questId])) as QuestWithCheckpoints[])[0];
  const stats = await getStats(userId);
  const heroes = await getHeroesByIds(heroIds);

  return Promise.resolve({ quest, stats, heroes });
};

type QuestWithProgressRow = {
  id: string;
  level: string;
  title: string;
  description: string;
  travel_time: string;
  duration: string;
  fame: string;
  tribute: string;
  experience: string;
  progress_id: string | null;
  embarked_time: Date | null;
  progress_duration: string | null;
  completed: boolean | null;
};

const mapQuestWithProgress = (row: QuestWithProgressRow): QuestWithProgress => {
  return {
    id: +row.id,
    level: +row.level,
    title: row.title,
    description: row.description,
    travelTime: +row.travel_time,
    duration: +row.duration,
    fame: +row.fame,
    tribute: +row.tribute,
    experience: +row.experience,
    progressId: row.progress_id ? +row.progress_id : undefined,
    embarkedTime: row.embarked_time ?? undefined,
    progressDuration: row.progress_duration ? +row.progress_duration : undefined,
    completed: row.completed ?? undefined,
  };
};
