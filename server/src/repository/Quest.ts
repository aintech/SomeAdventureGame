import { GUILD_SHARE } from "../utils/Variables";
import query from "./Db";
import { getHeroesByIds, getHeroesOnQuest, rewardHeroesForQuest } from "./Hero";
import { HeroActivityType, updateHeroActivities } from "./HeroActivity";
import { deleteCheckpoints, getQuestCheckpoints, QuestCheckpointWithProgress } from "./QuestCheckpoints";
import { completeProgress, createQuestProgress, deleteProgress } from "./QuestProgress";
import { addStats, getStats } from "./Stats";

export type Quest = {
  id: number;
  level: number;
  title: string;
  description: string;
  duration: number;
  fame: number;
  tribute: number;
  experience: number;
  progress_id: number | null;
  embarket_time: Date | null;
  progress_duration: number | null;
  completed: boolean | null;
  checkpoints: QuestCheckpointWithProgress[] | null;
};

const getQuestsByIds = async (userId: number, questIds: number[], withCheckpoints = true) => {
  const quests = await query<Quest[]>(
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
    [userId]
  );

  return withCheckpoints ? addCheckpoints(quests) : quests;
};

const getQuests = async (userId: number) => {
  const quests = await query<Quest[]>(
    "getQuests",
    `select 
            quest.*, 
            progress.id as progress_id, 
            progress.embarked_time, 
            progress.duration as progress_duration
     from public.quest quest
     left join public.quest_progress progress 
            on progress.quest_id = quest.id and progress.user_id = $1
     where 
     quest.id not in (select quest_id from public.quest_progress where user_id = $1) 
     or progress.completed = false;`,
    [userId]
  );

  return addCheckpoints(quests, true);
};

const addCheckpoints = async (quests: Quest[], checkIfPassed = false) => {
  const progressIds = quests.filter((q) => q.progress_id !== null).map((q) => q.progress_id) as number[];
  const checkpoints = await getQuestCheckpoints(progressIds, checkIfPassed);

  for (const quest of quests) {
    quest.checkpoints = checkpoints.filter((c) => c.quest_progress_id === quest.progress_id);
  }

  return quests;
};

const embarkOnQuest = async (userId: number, questId: number, heroIds: number[]) => {
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
        activity_id: questId,
        duration: null,
      };
    })
  );

  const embarkedQuests = await getQuestsByIds(userId, [questId]);
  const embarkedHeroes = await getHeroesByIds(heroIds);

  return Promise.resolve({ embarkedQuests, embarkedHeroes });
};

const completeQuest = async (userId: number, questId: number, canceled = false) => {
  let quest = (await getQuestsByIds(userId, [questId]))[0];
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
          activity_id: null,
          duration: null,
        };
      })
    )
  );

  await Promise.all(queries);

  quest = (await getQuestsByIds(userId, [questId]))[0];
  const stats = await getStats(userId);
  const heroes = await getHeroesByIds(heroIds);

  return Promise.resolve({ quest, stats, heroes });
};

export { getQuests, getQuestsByIds, embarkOnQuest, completeQuest };
