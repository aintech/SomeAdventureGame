import query from "./db.js";
import { adjustHealth, getHeroesOnQuest } from "./hero.js";
import { getQuestProgress, getQuestsByIds } from "./quest.js";
import usePool from "./use-pool.js";

const persistQuestCheckpoints = async (progressId, checkpoints) => {
  await new Promise((resolve, reject) => {
    let sql = "";
    for (const checkpoint of checkpoints) {
      sql += `
          insert into public.quest_checkpoint 
          (quest_progress_id, type, occured_time, duration, outcome, actors)
          values
          (
            ${progressId},
            '${checkpoint.type}', 
            ${checkpoint.occured_time}, 
            ${checkpoint.duration},
            '${
              checkpoint.outcome instanceof Map
                ? JSON.stringify(Array.from(checkpoint.outcome.entries()))
                : checkpoint.outcome
            }',
            '${
              checkpoint.actors
                ? JSON.stringify(Array.from(checkpoint.actors.entries()))
                : null
            }');
          `;
    }

    usePool(sql, [], (error, _) => {
      if (error) {
        return reject(new Error(`createQuestCheckpoints ${error}`));
      }
      resolve({});
    });
  });

  return getQuestCheckpoints([progressId]);
};

const getQuestCheckpoint = (checkpointId) => {
  return new Promise((resolve, reject) => {
    usePool(
      `select * from public.quest_checkpoint where id = $1`,
      [checkpointId],
      (error, result) => {
        if (error) {
          return reject(new Error(`getQuestCheckpoint ${error}`));
        }
        resolve(result.rows[0]);
      }
    );
  });
};

const getQuestCheckpoints = (progressIds) => {
  return new Promise((resolve, reject) => {
    if (progressIds.length === 0) {
      return resolve([]);
    }

    usePool(
      `select 
            checkpoint.*, 
            progress.embarked_time 
       from public.quest_checkpoint checkpoint
       left join quest_progress progress on progress.id = checkpoint.quest_progress_id
       where quest_progress_id in (${progressIds.join(",")})`,
      [],
      (error, result) => {
        if (error) {
          return reject(new Error(`getQuestCheckpoints ${error}`));
        }
        resolve(result.rows);
      }
    );
  });
};

const getQuestCheckpointsByQuest = async (
  userId,
  questId,
  checkIfPassed = false
) => {
  const progress = await getQuestProgress(userId, questId);
  return getQuestCheckpoints([progress.id], checkIfPassed);
};

const checkpointPassed = async (userId, questId, checkpointId) => {
  const checkpoint = await getQuestCheckpoint(checkpointId);

  if (checkpoint.passed) {
    return;
  }

  if (checkpoint.type === "battle") {
    const outcome = JSON.parse(checkpoint.outcome);
    const heroDamage = new Map();
    const adjustments = [];
    for (const actions of outcome) {
      for (const action of actions[1]) {
        if (action.action === "opponent_attack_hero") {
          heroDamage.set(
            action.opponentId,
            (heroDamage.get(action.opponentId) ?? 0) + action.value
          );
        }
      }
    }

    for (const damage of heroDamage) {
      adjustments.push(adjustHealth(damage[0], damage[1]));
    }
  }

  await Promise.all([...adjustments, markAsPassed(checkpointId)]);

  const quests = await getQuestsByIds(userId, [questId]);
  const heroes = await getHeroesOnQuest(userId, questId);

  return { quest: quests[0], heroes };
};

const markAsPassed = (checkpointId) => {
  return query(
    "markAsPassed",
    `update public.quest_checkpoint set passed = true where id = $1`,
    [checkpointId]
  );
};

const deleteCheckpoints = (userId, questId) => {
  return new Promise((resolve, reject) => {
    usePool(
      `delete from public.quest_checkpoint 
       where quest_progress_id = 
       (select id from public.quest_progress where user_id = $1 and quest_id = $2)`,
      [userId, questId],
      (error, _) => {
        if (error) {
          return reject(new Error(`deleteCheckpoints ${error}`));
        }
        resolve({});
      }
    );
  });
};

export {
  persistQuestCheckpoints,
  getQuestCheckpoints,
  getQuestCheckpointsByQuest,
  checkpointPassed,
  deleteCheckpoints,
};
