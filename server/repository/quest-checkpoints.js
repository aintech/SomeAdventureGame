import { getQuestProgress } from "./quest.js";
import usePool from "./use-pool.js";

const persistQuestCheckpoints = async (progressId, checkpoints) => {
  await new Promise((resolve, reject) => {
    let sql = "";
    for (const checkpoint of checkpoints) {
      sql += `
          insert into public.quest_checkpoint 
          (quest_progress_id, type, occured_time, duration, outcome)
          values
          (
            ${progressId},
            '${checkpoint.type}', 
            ${checkpoint.occured_time}, 
            ${checkpoint.duration},
            '${
              checkpoint.type === "chest"
                ? checkpoint.outcome
                : JSON.stringify(checkpoint.outcome)
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

const getQuestCheckpoints = (progressIds, checkIfPassed = false) => {
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

const deleteCheckpoints = () => {
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
  deleteCheckpoints,
};
