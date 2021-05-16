import { Router } from "express";
import AuthMiddleware from "../middleware/auth-middleware.js";
import { getStats } from "../repository/stats.js";

const statsRouter = Router();

statsRouter.get("/:userId", AuthMiddleware, async (req, res) => {
  try {
    const stats = await getStats(req.params.userId);
    res.json(stats);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default statsRouter;
