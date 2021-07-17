import { HEALTH_PER_VITALITY } from "../../../client/src/utils/variables.js";
import query, { single } from "./db.js";
import { setHeroHealth } from "./hero.js";
import { adjustItemsById } from "./item.js";
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

const getQuestCheckpoint = async (checkpointId) => {
  return query(
    "getQuestCheckpoints",
    `select 
          checkpoint.*, 
          progress.quest_id,
          progress.embarked_time 
     from public.quest_checkpoint checkpoint
     left join quest_progress progress on progress.id = checkpoint.quest_progress_id
     where checkpoint.id = $1`,
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
          progress.quest_id,
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
      await checkpointPassed(checkpoint);
      checkpoint.passed = true;
    }
  }
};

const checkpointPassed = async (checkpoint) => {
  if (checkpoint.passed) {
    return;
  }

  if (checkpoint.type === "battle") {
    const adjustments = [];

    const outcome = JSON.parse(checkpoint.outcome);
    const heroesHP = await getHeroesHP(checkpoint.quest_id);
    const healthValues = new Map();
    const totalHPs = new Map();
    const usedItems = new Map();

    heroesHP.forEach((h) => {
      healthValues.set(h.id, h.health);
      totalHPs.set(h.id, h.total);
    });

    let maxSec = 0;
    outcome.forEach((out) => {
      if (out[0] > maxSec) {
        maxSec = out[0];
      }
    });

    for (let sec = 0; sec <= maxSec; sec++) {
      const actions = outcome.filter((o) => o[0] === sec);

      if (actions.length === 0) {
        continue;
      }

      for (const action of actions) {
        const steps = action[1];
        for (const step of steps) {
          if (step.action === "enemy_attack") {
            healthValues.set(
              step.heroId,
              healthValues.get(step.heroId) - +step.damage
            );
          }
          if (step.action === "use_potion") {
            usedItems.set(step.itemId, usedItems.get(step.itemId) ?? 0 - 1);
            healthValues.set(step.heroId, totalHPs.get(step.heroId));
          }
        }
      }
    }

    healthValues.forEach((v, k) => adjustments.push(setHeroHealth(k, v)));
    usedItems.forEach((v, k) => adjustments.push(adjustItemsById(k, v)));

    await Promise.all(adjustments);
  } else if (checkpoint.type === "treasure") {
    //do nothing
  } else {
    throw new Error(`Unknown checkpoint type! ${checkpoint}`);
  }

  await markAsPassed(checkpoint.id);
};

const getHeroesHP = async (questId) => {
  return query(
    "getHeroesHP",
    `select h.id, h.health, (h.vitality * $2) as total
     from public.hero h
     left join public.hero_activity a on a.hero_id = h.id
     where a.activity_id = $1 and a.activity_type = 'quest'`,
    [questId, HEALTH_PER_VITALITY]
  );
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
  getQuestCheckpoint,
  getQuestCheckpoints,
  getQuestCheckpointsByQuest,
  checkpointPassed,
  deleteCheckpoints,
};
