import { GUILD_SHARE } from '../../utils/Variables';
import query, { single } from '../Db';
import { getHeroesByIds, getHeroesOnQuest, rewardHeroesForQuest } from '../hero/Hero';
import { HeroActivityType, updateHeroActivities } from '../hero/HeroActivity';
import { deleteCheckpoints, getQuestCheckpoints, QuestCheckpointWithProgress } from './QuestCheckpoint';
import { completeProgress, createQuestProgress, deleteProgress } from './QuestProgress';
import { addStats, getStats } from '../Stats';

export type Quest = {
  id: number;
  level: number;
  title: string;
  description: string;
  travelTime: number;
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

export const getQuestById = async (userId: number, questId: number, withCheckpoints = true) => {
  const quest = await query<QuestWithCheckpoints>(
    'getQuestsById',
    `select 
          quest.*, 
          progress.id as progress_id,
          progress.embarked_time, 
          progress.completed 
     from public.quest quest 
     left join public.quest_progress progress 
          on progress.quest_id = quest.id and progress.user_id = $1
     where quest.id = $2;`,
    [userId, questId],
    mapQuestWithProgress,
    single
  );

  return withCheckpoints ? addCheckpoint(quest) : quest;
};

const addCheckpoint = async (quest: QuestWithProgress) => {
  if (quest.progressId) {
    const checkpoints = await getQuestCheckpoints([quest.progressId]);
    return { ...quest, checkpoints };
  }
  return { ...quest, checkpoints: [] };
};

export const getQuests = async (userId: number) => {
  const quests = await query<QuestWithProgress[]>(
    'getQuests',
    `select 
            quest.*, 
            progress.id as progress_id, 
            progress.embarked_time, 
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

  return addCheckpoints(quests);
};

const addCheckpoints = async (quests: QuestWithProgress[]) => {
  const progressIds = quests.filter((q) => q.progressId !== undefined).map((q) => q.progressId) as number[];
  const checkpoints = await getQuestCheckpoints(progressIds);

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
  const quest = await getQuestById(userId, questId, false);
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

  const embarkedQuest = await getQuestById(userId, questId);
  const embarkedHeroes = await getHeroesByIds(heroIds);

  return Promise.resolve({ embarkedQuest, embarkedHeroes });
};

export const completeQuest = async (userId: number, questId: number, canceled = false) => {
  let quest = await getQuestById(userId, questId);
  const heroIds = (await getHeroesOnQuest(userId, questId)).map((h) => h.id);
  const queries: Promise<any>[] = [];

  if (canceled) {
    queries.push(deleteProgress(quest.progressId!));
  } else {
    const heroesTribute = Math.ceil(quest.tribute * (1 - GUILD_SHARE));
    const playerTribute = Math.floor(quest.tribute * GUILD_SHARE);

    queries.push(rewardHeroesForQuest(userId, heroIds, heroesTribute, quest.experience));
    queries.push(completeProgress(quest.progressId!));
    queries.push(addStats(userId, playerTribute, quest.fame));
  }

  queries.push(deleteCheckpoints(quest.progressId!));
  queries.push(
    updateHeroActivities(
      userId,
      heroIds.map((id) => {
        return {
          heroId: id,
          type: HeroActivityType.IDLE,
          description: 'Не при делах',
        };
      })
    )
  );

  await Promise.all(queries);

  quest = await getQuestById(userId, questId, false);
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
    fame: +row.fame,
    tribute: +row.tribute,
    experience: +row.experience,
    progressId: row.progress_id ? +row.progress_id : undefined,
    embarkedTime: row.embarked_time ?? undefined,
    progressDuration: row.progress_duration ? +row.progress_duration : undefined,
    completed: row.completed ?? undefined,
  };
};
