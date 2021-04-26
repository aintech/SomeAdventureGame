import { Router } from "express";
import AuthMiddleware from "../middleware/auth-middleware.js";
import { getUserHeroes } from "../models/hero.js";

const gamedataRouter = Router();

gamedataRouter.get("/heroes/:userId", AuthMiddleware, async (req, res) => {
  try {
    const heroes = await getUserHeroes(req.params.userId);
    res.json(heroes);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default gamedataRouter;
