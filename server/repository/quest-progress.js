import getBattleOutcome from "../battle/battle-processor.js";
import { getMonsterParty } from "./monster.js";
import { persistQuestCheckpoints } from "./quest-checkpoints.js";
import usePool from "./use-pool.js";

const generateCheckpoints = async (quest, heroes) => {
  const checkpoints = [];

  const checkpointsCount = Math.floor(quest.duration * 0.5 * 0.1);

  let checkpointsDuration = 0;
  for (let i = 0; i < checkpointsCount; i++) {
    const type = i % 2 == 0 ? "battle" : "treasure"; //Math.random() > 1 ? "treasure" : "battle";

    const checkpointTime = i * 10;
    //пока чекпоинты начинаются с первой десятой части квеста
    const addSec = 5 + checkpointTime + checkpointsDuration;
    // Math.floor(quest.duration * 0.1) * 1000 + periodBetweenCheckpoints;
    // Math.floor(questDuration * 0.5) +
    // i * Math.floor(Math.random() * 10) * 1000;

    const occured_time = addSec;

    let outcome;
    let actors;
    let duration;
    switch (type) {
      case "treasure":
        outcome = quest.level * Math.floor(Math.random() * 20 + 10);
        duration = 10;
        break;
      case "battle":
        const monsters = await getMonsterParty(quest.level);
        outcome = getBattleOutcome(monsters, heroes);
        actors = monsters.map((m) => {
          return { ...m };
        });
        duration = Math.max(...outcome.keys());
        break;
      default:
        throw new Error(`Unknown checkpoint type ${type}`);
    }

    checkpointsDuration += duration;

    checkpoints.push({ type, occured_time, duration, outcome, actors });
  }

  return checkpoints;
};

const persistProgress = (userId, questId, checkpoints) => {
  const checkpointsDuration = checkpoints
    .map((c) => +c.duration)
    .reduce((a, b) => a + b);

  return new Promise((resolve, reject) => {
    usePool(
      `with quest_duration as (select duration as d from public.quest where id = $2)
       insert into public.quest_progress 
       (user_id, quest_id, duration, embarked_time) 
       values ($1, $2, (select d from quest_duration) + $3, now()) 
       returning id`,
      [userId, questId, checkpointsDuration],
      (error, result) => {
        if (error) {
          return reject(new Error(`createQuestProgress ${error}`));
        }
        resolve(result.rows[0].id);
      }
    );
  });
};

const createQuestProgress = async (userId, quest, heroes) => {
  const checkpoints = await generateCheckpoints(quest, heroes);
  const progressId = await persistProgress(userId, quest.id, checkpoints);
  await persistQuestCheckpoints(progressId, checkpoints);
  return progressId;
};

const completeProgress = (userId, questId) => {
  return new Promise((resolve, reject) => {
    usePool(
      `update public.quest_progress 
       set completed = true 
       where user_id = $1 and quest_id = $2`,
      [userId, questId],
      (error, _) => {
        if (error) {
          return reject(new Error(`completeProgress ${error}`));
        }
        resolve({});
      }
    );
  });
};

export { createQuestProgress, completeProgress };
