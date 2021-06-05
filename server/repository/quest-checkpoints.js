import query, { single } from "./db.js";
import { adjustHealth, getHeroesOnQuest } from "./hero.js";
import { getQuestProgress, getQuestsByIds } from "./quest.js";

const persistQuestCheckpoints = async (progressId, checkpoints) => {
  await query(
    "persistQuestCheckpoints",
    checkpoints
      .map(
        (c) =>
          `insert into public.quest_checkpoint 
           (quest_progress_id, type, occured_time, duration, outcome, enemies, tribute, passed)
           values
           (
            ${progressId},
            '${c.type}', 
            ${c.occured_time}, 
            ${c.duration},
            ${
              c.outcome
                ? `'${JSON.stringify(Array.from(c.outcome.entries()))}'`
                : null
            },
            '${c.enemies ? JSON.stringify(c.enemies) : null}',
            '${c.tribute}',
            false
           );
          `
      )
      .join(" ")
  );

  return getQuestCheckpoints([progressId]);
};

const getQuestCheckpoint = (checkpointId) => {
  return query(
    "getQuestCheckpoint",
    `select * from public.quest_checkpoint where id = $1`,
    [checkpointId],
    single
  );
};

const getQuestCheckpoints = (progressIds) => {
  if (progressIds.length === 0) {
    return [];
  }
  return query(
    "getQuestCheckpoints",
    `select 
          checkpoint.*, 
          progress.embarked_time 
     from public.quest_checkpoint checkpoint
     left join quest_progress progress on progress.id = checkpoint.quest_progress_id
     where quest_progress_id in (${progressIds.join(",")})`
  );
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
    const damages = new Map();
    const adjustments = [];
    for (const actions of outcome) {
      for (const action of actions[1]) {
        if (action.action === "enemy_attack") {
          damages.set(
            action.herotId,
            (damages.get(action.heroId) ?? 0) - +action.damage
          );
        }
      }
    }

    for (const damage of damages) {
      adjustments.push(adjustHealth(damage[0], damage[1]));
    }
    await Promise.all(adjustments);
  }

  await markAsPassed(checkpointId);

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
  return query(
    "deleteCheckpoint",
    `delete from public.quest_checkpoint 
     where quest_progress_id = 
     (select id from public.quest_progress where user_id = $1 and quest_id = $2)`,
    [userId, questId]
  );
};

export {
  persistQuestCheckpoints,
  getQuestCheckpoints,
  getQuestCheckpointsByQuest,
  checkpointPassed,
  deleteCheckpoints,
};
