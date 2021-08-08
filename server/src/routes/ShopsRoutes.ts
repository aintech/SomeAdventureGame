import { Router } from "express";
import AuthMiddleware from "../middleware/AuthMiddleware";
import { getAlchemistAssortment, getMarketAssortment } from "../repository/ShopsAssortment";

const shopsRouter = Router();

shopsRouter.get("/market", AuthMiddleware, async (req, res) => {
  const user_id = Number(req.query.user_id as string);
  try {
    const assortment = await getMarketAssortment(user_id);
    res.json(assortment);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

shopsRouter.get("/alchemist", AuthMiddleware, async (req, res) => {
  const user_id = Number(req.query.user_id as string);
  try {
    const assortment = await getAlchemistAssortment(user_id);
    res.json(assortment);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default shopsRouter;
