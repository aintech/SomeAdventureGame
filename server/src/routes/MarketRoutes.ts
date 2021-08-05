import { Router } from "express";
import AuthMiddleware from "../middleware/AuthMiddleware";
import { getAssortment } from "../repository/MarketAssortment";

const marketRouter = Router();

marketRouter.get("/", AuthMiddleware, async (req, res) => {
  const user_id = Number(req.query.user_id as string);
  try {
    const assortment = await getAssortment(user_id);
    res.json(assortment);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default marketRouter;
