import { Router } from "express";
import AuthMiddleware from "../middleware/auth-middleware.js";
import { getHeroesOnQuest } from "../repository/hero.js";
import {
  checkpointPassed,
  getQuestCheckpoint,
} from "../repository/quest-checkpoints.js";
import {
  completeQuest,
  embarkOnQuest,
  getQuests,
  getQuestsByIds,
} from "../repository/quest.js";

const questsRouter = Router();

questsRouter.get("/", AuthMiddleware, async (req, res) => {
  try {
    const quests = await getQuests(req.query.user_id);
    res.json(quests);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

questsRouter.post("/embark", AuthMiddleware, async (req, res) => {
  try {
    const embarked = await embarkOnQuest(
      req.query.user_id,
      req.body.questId,
      req.body.heroIds
    );
    res.json(embarked);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

questsRouter.put("/checkpoint", AuthMiddleware, async (req, res) => {
  try {
    const { user_id, quest_id, checkpoint_id } = req.query;

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
  try {
    const completed = await completeQuest(
      req.query.user_id,
      req.query.quest_id
    );
    res.json(completed);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

questsRouter.put("/cancel", AuthMiddleware, async (req, res) => {
  try {
    const cancelled = await completeQuest(
      req.query.user_id,
      req.query.quest_id,
      true
    );
    res.json(cancelled);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default questsRouter;
