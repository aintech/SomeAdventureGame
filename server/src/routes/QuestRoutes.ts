import { Router } from "express";
import AuthMiddleware from "../middleware/AuthMiddleware";
import { getHeroesOnQuest } from "../repository/hero/Hero";
import { completeQuest, embarkOnQuest, getQuestById, getQuests } from "../repository/quest/Quest";
import { checkpointPassed, getQuestCheckpoint } from "../repository/quest/QuestCheckpoints";

const questsRouter = Router();

questsRouter.get("/", AuthMiddleware, async (req, res) => {
  const user_id = Number(req.query.user_id as string);
  try {
    const quests = await getQuests(user_id);
    res.json(quests);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

questsRouter.post("/embark", AuthMiddleware, async (req, res) => {
  const user_id = Number(req.query.user_id as string);
  const quest_id = Number(req.query.quest_id as string);
  const hero_ids = (req.query.hero_ids as string).split(",").map((id) => +id);
  try {
    const embarked = await embarkOnQuest(user_id, quest_id, hero_ids);
    res.json(embarked);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

export type HeroEvent = {
  time: number;
  itemId?: number;
  hpAlter?: number;
};

export type CheckpointPassedBody = {
  id: number;
  collected: { actorId: number; drops: number[] }[];
  events?: { heroId: number; events: HeroEvent[] }[];
};

questsRouter.post("/checkpoint-passed", AuthMiddleware, async (req, res) => {
  const userId = Number(req.query.user_id as string);
  const questId = Number(req.query.quest_id as string);
  const checkpointId = Number(req.query.checkpoint_id as string);
  try {
    const heroesOnQuest = await getHeroesOnQuest(userId, questId);
    const checkpoint = await getQuestCheckpoint(checkpointId);
    await checkpointPassed(checkpoint, heroesOnQuest, req.body);

    const quest = await getQuestById(userId, questId);
    const heroes = await getHeroesOnQuest(userId, questId);

    res.json({ quest, heroes });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

questsRouter.put("/complete", AuthMiddleware, async (req, res) => {
  const user_id = Number(req.query.user_id as string);
  const quest_id = Number(req.query.quest_id as string);
  try {
    const completed = await completeQuest(user_id, quest_id);
    res.json(completed);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

questsRouter.put("/cancel", AuthMiddleware, async (req, res) => {
  const user_id = Number(req.query.user_id as string);
  const quest_id = Number(req.query.quest_id as string);
  try {
    const cancelled = await completeQuest(user_id, quest_id, true);
    res.json(cancelled);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

export default questsRouter;
