import { Router } from "express";
import AuthMiddleware from "../middleware/auth-middleware.js";
import {
  completeQuest,
  embarkOnQuest,
  getQuests,
} from "../repository/quest.js";

const questsRouter = Router();

questsRouter.get("/:userId", AuthMiddleware, async (req, res) => {
  try {
    const quests = await getQuests(req.params.userId);
    res.json(quests);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

questsRouter.post("/embark/:userId", AuthMiddleware, async (req, res) => {
  try {
    const embarked = await embarkOnQuest(
      req.params.userId,
      req.body.questId,
      req.body.heroIds
    );
    res.json(embarked);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

questsRouter.post("/complete/:userId", AuthMiddleware, async (req, res) => {
  try {
    const completed = await completeQuest(
      req.params.userId,
      req.body.questId,
      req.body.heroIds
    );
    res.json(completed);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default questsRouter;
