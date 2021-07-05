import query, { single } from "./db.js";
import { adjustHeroHealth } from "./hero.js";
import { getQuestProgress } from "./quest-progress.js";

const persistQuestCheckpoints = async (progressId, checkpoints) => {
  await query(
    "persistQuestCheckpoints",
    checkpoints
      .map(
        (c) =>
          `insert into public.quest_checkpoint 
           (quest_progress_id, type, occured_at, duration, outcome, enemies, tribute, passed)
           values
           (
            ${progressId},
            '${c.type}', 
            ${c.occured_at}, 
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

const getQuestCheckpoints = async (progressIds, checkIfPassed = false) => {
  if (progressIds.length === 0) {
    return [];
  }
  const checkpoints = await query(
    "getQuestCheckpoints",
    `select 
          checkpoint.*, 
          progress.embarked_time 
     from public.quest_checkpoint checkpoint
     left join quest_progress progress on progress.id = checkpoint.quest_progress_id
     where quest_progress_id in (${progressIds.join(",")})`
  );

  if (checkIfPassed) {
    checkIfCheckpointPassed(checkpoints);
  }

  return checkpoints;
};

const getQuestCheckpointsByQuest = async (userId, questId) => {
  const progress = await getQuestProgress(userId, questId);
  return getQuestCheckpoints([progress.id]);
};

const checkIfCheckpointPassed = async (checkpoints) => {
  for (const checkpoint of checkpoints) {
    if (checkpoints.passed) {
      continue;
    }

    const endedIn =
      new Date(checkpoint.embarked_time).getTime() +
      +checkpoint.occured_at * 1000 +
      +checkpoint.duration * 1000;

    if (endedIn <= new Date().getTime()) {
      await checkpointPassed(checkpoint.id);
      checkpoint.passed = true;
    }
  }
};

const checkpointPassed = async (checkpointId) => {
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
            action.heroId,
            (damages.get(action.heroId) ?? 0) - +action.damage
          );
        }
      }
    }

    for (const damage of damages) {
      adjustments.push(adjustHeroHealth(damage[0], damage[1]));
    }

    await Promise.all(adjustments);
  }

  await markAsPassed(checkpointId);
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
