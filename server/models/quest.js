import {
  completeHeroesQuest,
  embarkHeroesOnQuest,
  getHeroesByIds,
} from "./hero.js";
import { addStats, getStats } from "./stats.js";
import usePool from "./use-pool.js";

const getQuests = (userId) => {
  return new Promise((resolve, reject) => {
    usePool(
      `select q.*, u.embarked_time 
       from public.quest q 
       left join public.user_to_quest u on u.quest_id = q.id and u.user_id = $1
       where 
       q.id not in (select quest_id from public.user_to_quest where user_id = $1) 
       or u.completed = false;`,
      [userId],
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result.rows);
      }
    );
  });
};

const getQuestsById = (userId, questIds) => {
  return new Promise((resolve, reject) => {
    usePool(
      `select q.*, u.embarked_time 
       from public.quest q 
       left join public.user_to_quest u on u.quest_id = q.id and u.user_id = $1
       where 
       q.id in (${questIds.join(",")});`,
      [userId],
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result.rows);
      }
    );
  });
};

const embarkOnQuest = async (userId, questId, heroIds) => {
  const insertLink = new Promise((resolve, reject) => {
    usePool(
      `insert into public.user_to_quest 
       (user_id, quest_id, embarked_time, completed)
       values ($1, $2, now(), false)`,
      [userId, questId],
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve({});
      }
    );
  });

  const embarkHeroes = embarkHeroesOnQuest(questId, heroIds);

  await Promise.all([insertLink, embarkHeroes]);

  const embarkedHeroes = await getHeroesByIds(heroIds);
  const embarkedQuests = await getQuestsById(userId, [questId]);

  return Promise.resolve({ embarkedQuests, embarkedHeroes });
};

const completeQuest = async (userId, questId, heroIds) => {
  const quests = await getQuestsById(userId, [questId]);
  const quest = quests[0];

  const heroesTribute = Math.floor(quest.tribute * 0.5);
  const playerTribute = quest.tribute - heroesTribute;

  await completeHeroesQuest(heroIds, heroesTribute, quest.experience);

  await addStats(userId, playerTribute, quest.fame);

  await new Promise((resolve, reject) => {
    usePool(
      `update public.user_to_quest 
       set completed = true 
       where user_id = $1 and quest_id = $2`,
      [userId, questId],
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve({});
      }
    );
  });

  const stats = await getStats(userId);
  const heroes = await getHeroesByIds(heroIds);

  return Promise.resolve({ quest, stats, heroes });
};

export { getQuests, embarkOnQuest, completeQuest };
