import {
  completeHeroesQuest,
  embarkHeroesOnQuest,
  getHeroesByIds,
} from "./hero.js";
import { addStats, getStats } from "./stats.js";
import usePool from "./use-pool.js";

const GUILD_SHARE = 0.5;

const _createQuestCheckpoints = (progressId, questDuration) => {
  return new Promise((resolve, reject) => {
    const checkpoints = [];
    let sql = "";
    //чекпоинты начинаются со второй трети квеста, и происходят примерно каждые 30 секунд
    const checkpointsCount = 3; //Math.floor(questDuration * 0.5 * 0.1);
    for (let i = 0; i < checkpointsCount; i++) {
      const periodBetween = i * 10 * 1000;
      const addSec = Math.floor(questDuration * 0.3) * 1000 + periodBetween;
      // Math.floor(questDuration * 0.5) +
      // i * Math.floor(Math.random() * 10) * 1000;

      const occure_time = new Date(new Date().getTime() + addSec);
      const type = "gold";
      const value = Math.floor(Math.random() * 20 + 10);

      checkpoints.push({ occure_time, type, value });

      sql += `
      insert into public.quest_checkpoint 
      (quest_progress_id, occure_time, type, value)
      values
      (
        ${progressId},
        to_timestamp(${new Date(occure_time).getTime()} / 1000), 
        '${type}', 
        '${value}');
      `;
    }

    usePool(sql, [], (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(checkpoints);
    });
  });
};

const _getQuestCheckpoints = (progressIds) => {
  return new Promise((resolve, reject) => {
    if (progressIds.length === 0) {
      return resolve([]);
    }

    usePool(
      `select * from public.quest_checkpoint 
       where quest_progress_id in (${progressIds.join(",")})`,
      [],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.rows);
      }
    );
  });
};

const _getQuestCheckpointsByQuest = (userId, questId) => {
  return new Promise((resolve, reject) => {
    usePool(
      `select * from public.quest_checkpoint 
       where quest_progress_id in 
       (select id from quest_progress where user_id = $1 and quest_id = $2)`,
      [userId, questId],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.rows);
      }
    );
  });
};

const _getQuestsById = (userId, questIds) => {
  return new Promise((resolve, reject) => {
    usePool(
      `select q.*, u.embarked_time 
       from public.quest q 
       left join public.quest_progress u on u.quest_id = q.id and u.user_id = $1
       where 
       q.id in (${questIds.join(",")});`,
      [userId],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.rows);
      }
    );
  });
};

const getQuests = async (userId) => {
  const quests = await new Promise((resolve, reject) => {
    usePool(
      `select q.*, p.id as progress_id, p.embarked_time 
       from public.quest q 
       left join public.quest_progress p on p.quest_id = q.id and p.user_id = $1
       where 
       q.id not in (select quest_id from public.quest_progress where user_id = $1) 
       or p.completed = false;`,
      [userId],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.rows);
      }
    );
  });

  const checkpoints = await _getQuestCheckpoints(
    quests.filter((q) => q.progress_id).map((q) => q.progress_id)
  );

  for (const quest of quests) {
    quest.checkpoints = checkpoints.filter(
      (c) => c.quest_progress_id === quest.progress_id
    );
  }

  return quests;
};

const embarkOnQuest = async (userId, questId, heroIds) => {
  const createQuestProgress = new Promise((resolve, reject) => {
    usePool(
      `insert into public.quest_progress 
       (user_id, quest_id, embarked_time, completed)
       values ($1, $2, now(), false) 
       returning id`,
      [userId, questId],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.rows);
      }
    );
  });

  const embarkHeroes = embarkHeroesOnQuest(questId, heroIds);

  let questProgress;
  await Promise.all([
    createQuestProgress.then((data) => (questProgress = data[0])),
    embarkHeroes,
  ]);

  const embarkedQuests = await _getQuestsById(userId, [questId]);

  const questCheckpoints = await _createQuestCheckpoints(
    questProgress.id,
    embarkedQuests[0].duration
  );

  embarkedQuests[0].checkpoints = questCheckpoints;

  const embarkedHeroes = await getHeroesByIds(heroIds);

  return Promise.resolve({ embarkedQuests, embarkedHeroes });
};

const completeQuest = async (userId, questId, heroIds) => {
  const quests = await _getQuestsById(userId, [questId]);
  const quest = quests[0];

  const checkpoints = await _getQuestCheckpointsByQuest(userId, questId);
  const checkpointsTribute = checkpoints
    .filter((c) => c.type === "gold")
    .map((c) => +c.value)
    .reduce((a, b) => a + b);

  const heroesTribute =
    Math.floor(quest.tribute * (1 - GUILD_SHARE)) + checkpointsTribute;
  const playerTribute = Math.floor(quest.tribute * GUILD_SHARE);

  await completeHeroesQuest(heroIds, heroesTribute, quest.experience);

  await addStats(userId, playerTribute, quest.fame);

  await new Promise((resolve, reject) => {
    usePool(
      `update public.quest_progress 
       set completed = true 
       where user_id = $1 and quest_id = $2`,
      [userId, questId],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({});
      }
    );
  });

  await new Promise((resolve, reject) => {
    usePool(
      `delete from public.quest_checkpoint 
      where quest_progress_id = 
      (select id from public.quest_progress where user_id = $1 and quest_id = $2)`,
      [userId, questId],
      (error, result) => {
        if (error) {
          return reject(error);
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
