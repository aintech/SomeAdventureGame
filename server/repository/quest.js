import {
  completeHeroesQuest,
  embarkHeroesOnQuest,
  getHeroesByIds,
} from "./hero.js";
import {
  getQuestCheckpoints,
  getQuestCheckpointsByQuest,
  deleteCheckpoints,
} from "./quest-checkpoints.js";
import { completeProgress, createQuestProgress } from "./quest-progress.js";
import { addStats, getStats } from "./stats.js";
import usePool from "./use-pool.js";

const GUILD_SHARE = 0.5;

const getQuestsByIds = (userId, questIds) => {
  return new Promise((resolve, reject) => {
    usePool(
      `select 
            quest.*, 
            progress.id as progress_id,
            progress.embarked_time, 
            progress.duration as progress_duration 
       from public.quest quest 
       left join public.quest_progress progress 
            on progress.quest_id = quest.id and progress.user_id = $1
       where quest.id in (${questIds.join(",")});`,
      [userId],
      (error, result) => {
        if (error) {
          return reject(new Error(`getQuestsByIds ${error}`));
        }
        resolve(result.rows);
      }
    );
  });
};

const getQuests = async (userId) => {
  const quests = await new Promise((resolve, reject) => {
    usePool(
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
      [userId],
      (error, result) => {
        if (error) {
          return reject(new Error(`getQuests ${error}`));
        }
        resolve(result.rows);
      }
    );
  });
  const checkpoints = await getQuestCheckpoints(
    quests.filter((q) => q.progress_id).map((q) => q.progress_id),
    true
  );

  for (const quest of quests) {
    quest.checkpoints = checkpoints.filter(
      (c) => c.quest_progress_id === quest.progress_id
    );
  }

  return quests;
};

const getQuestProgress = (userId, questId) => {
  return new Promise((resolve, reject) => {
    usePool(
      `select * from public.quest_progress where user_id = $1 and quest_id = $2`,
      [userId, questId],
      (error, result) => {
        if (error) {
          return reject(new Error(`getQuestProgress ${error}`));
        }
        resolve(result.rows[0]);
      }
    );
  });
};

const embarkOnQuest = async (userId, questId, heroIds) => {
  const fetchedQuests = await getQuestsByIds(userId, [questId]);
  const quest = fetchedQuests[0];
  const heroes = await getHeroesByIds(heroIds);

  const progressId = await createQuestProgress(userId, quest, heroes);

  await embarkHeroesOnQuest(questId, heroIds);

  const embarkedQuests = await getQuestsByIds(userId, [questId]);
  const embarkedHeroes = await getHeroesByIds(heroIds);
  const questCheckpoints = await getQuestCheckpoints([progressId]);

  embarkedQuests[0].checkpoints = questCheckpoints;

  return Promise.resolve({ embarkedQuests, embarkedHeroes });
};

const completeQuest = async (userId, questId, heroIds) => {
  const quests = await getQuestsByIds(userId, [questId]);
  const quest = quests[0];

  const checkpoints = await getQuestCheckpointsByQuest(userId, questId);
  const checkpointsTribute = checkpoints
    .filter((c) => c.type === "chest")
    .map((c) => +c.outcome)
    .reduce((a, b) => a + b);

  const heroesTribute =
    Math.floor(quest.tribute * (1 - GUILD_SHARE)) + checkpointsTribute;
  const playerTribute = Math.floor(quest.tribute * GUILD_SHARE);

  await completeHeroesQuest(heroIds, heroesTribute, quest.experience);

  await addStats(userId, playerTribute, quest.fame);

  await completeProgress(userId, questId);

  await deleteCheckpoints(userId, questId);

  const stats = await getStats(userId);

  const heroes = await getHeroesByIds(heroIds);

  return Promise.resolve({ quest, stats, heroes });
};

export {
  getQuests,
  getQuestsByIds,
  getQuestProgress,
  embarkOnQuest,
  completeQuest,
};
