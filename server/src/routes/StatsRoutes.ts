import { Router } from "express";
import AuthMiddleware from "../middleware/AuthMiddleware";
import { getStats } from "../repository/Stats";

const statsRouter = Router();

statsRouter.get("/", AuthMiddleware, async (req, res) => {
  const user_id = Number(req.query.user_id as string);
  try {
    const stats = await getStats(user_id);
    res.json(stats);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default statsRouter;
