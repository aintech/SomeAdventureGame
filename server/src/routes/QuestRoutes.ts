import { Router } from "express";
import AuthMiddleware from "../middleware/AuthMiddleware";
import { getHeroesOnQuest } from "../repository/hero/Hero";
import { checkpointPassed, getQuestCheckpoint } from "../repository/quest/QuestCheckpoints";
import { completeQuest, embarkOnQuest, getQuests, getQuestsByIds } from "../repository/quest/Quest";

const questsRouter = Router();

questsRouter.get("/", AuthMiddleware, async (req, res) => {
  const user_id = Number(req.query.user_id as string);
  try {
    const quests = await getQuests(user_id);
    res.json(quests);
  } catch (e) {
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
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

questsRouter.put("/checkpoint", AuthMiddleware, async (req, res) => {
  const user_id = Number(req.query.user_id as string);
  const quest_id = Number(req.query.quest_id as string);
  const checkpoint_id = Number(req.query.checkpoint_id as string);
  try {
    const checkpoint = await getQuestCheckpoint(checkpoint_id);
    await checkpointPassed(checkpoint);

    const quests = await getQuestsByIds(user_id, [quest_id]);
    const heroes = await getHeroesOnQuest(user_id, quest_id);

    res.json({ quest: quests[0], heroes });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

questsRouter.put("/complete", AuthMiddleware, async (req, res) => {
  const user_id = Number(req.query.user_id as string);
  const quest_id = Number(req.query.quest_id as string);
  try {
    const completed = await completeQuest(user_id, quest_id);
    res.json(completed);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

questsRouter.put("/cancel", AuthMiddleware, async (req, res) => {
  const user_id = Number(req.query.user_id as string);
  const quest_id = Number(req.query.quest_id as string);
  try {
    const cancelled = await completeQuest(user_id, quest_id, true);
    res.json(cancelled);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default questsRouter;
