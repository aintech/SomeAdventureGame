import query from "./db.js";
import { updateHeroActivities } from "./hero-activity.js";
import {
  getHeroesByIds,
  getHeroesOnQuest,
  rewardHeroesForQuest,
} from "./hero.js";
import {
  deleteCheckpoints,
  getQuestCheckpoints,
  getQuestCheckpointsByQuest,
} from "./quest-checkpoints.js";
import {
  completeProgress,
  createQuestProgress,
  deleteProgress,
} from "./quest-progress.js";
import { addStats, getStats } from "./stats.js";

const GUILD_SHARE = 0.5;

const getQuestsByIds = async (userId, questIds, withCheckpoints = true) => {
  const quests = await query(
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

const getQuests = async (userId) => {
  const quests = await query(
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

const addCheckpoints = async (quests, checkIfPassed = false) => {
  const checkpoints = await getQuestCheckpoints(
    quests.filter((q) => q.progress_id).map((q) => q.progress_id),
    checkIfPassed
  );

  for (const quest of quests) {
    quest.checkpoints = checkpoints.filter(
      (c) => c.quest_progress_id === quest.progress_id
    );
  }

  return quests;
};

const embarkOnQuest = async (userId, questId, heroIds) => {
  const fetchedQuests = await getQuestsByIds(userId, [questId], false);
  const quest = fetchedQuests[0];
  const heroes = await getHeroesByIds(heroIds);

  await createQuestProgress(userId, quest, heroes);

  await updateHeroActivities(
    userId,
    heroIds.map((id) => {
      return {
        heroId: id,
        type: "quest",
        activity_id: questId,
      };
    })
  );

  const embarkedQuests = await getQuestsByIds(userId, [questId]);
  const embarkedHeroes = await getHeroesByIds(heroIds);

  return Promise.resolve({ embarkedQuests, embarkedHeroes });
};

const completeQuest = async (userId, questId, canceled = false) => {
  let quest = (await getQuestsByIds(userId, [questId]))[0];
  const heroIds = (await getHeroesOnQuest(userId, questId)).map((h) => h.id);
  const queries = [];

  if (canceled) {
    queries.push(deleteProgress(userId, questId));
  } else {
    const checkpointsTribute = quest.checkpoints
      .map((c) => +c.tribute)
      .reduce((a, b) => a + b, 0);
    const heroesTribute =
      Math.floor(quest.tribute * (1 - GUILD_SHARE)) + checkpointsTribute;
    const playerTribute = Math.floor(quest.tribute * GUILD_SHARE);

    queries.push(
      rewardHeroesForQuest(userId, heroIds, heroesTribute, quest.experience)
    );
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
          type: "idle",
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
