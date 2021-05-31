import { Router } from "express";
import AuthMiddleware from "../middleware/auth-middleware.js";
import { checkpointPassed } from "../repository/quest-checkpoints.js";
import {
  completeQuest,
  embarkOnQuest,
  getQuests,
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
    const passed = await checkpointPassed(
      req.query.user_id,
      req.query.checkpoint_id
    );
    res.json(passed);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

questsRouter.post("/complete", AuthMiddleware, async (req, res) => {
  try {
    const completed = await completeQuest(
      req.query.user_id,
      req.body.questId,
      req.body.heroIds
    );
    res.json(completed);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default questsRouter;
