import { Router } from "express";
import AuthMiddleware from "../middleware/auth-middleware.js";
import {
  getHeroes,
  hireHero,
  updateHeroOccupation,
} from "../repository/hero.js";
import { getTavernPatrons } from "../repository/tavern-patrons.js";
import { getStats } from "../repository/stats.js";

const heroesRouter = Router();

heroesRouter.get("/", AuthMiddleware, async (req, res) => {
  try {
    const heroes = await getHeroes(req.query.user_id);
    res.json(heroes);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

heroesRouter.get("/tavern", AuthMiddleware, async (req, res) => {
  try {
    const tavernPatrons = await getTavernPatrons(req.query.user_id);
    res.json(tavernPatrons);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

heroesRouter.put("/hire", AuthMiddleware, async (req, res) => {
  try {
    const hired = (await hireHero(req.query.user_id, req.query.hero_id))[0];
    const stats = await getStats(req.query.user_id);
    res.json({ stats, hired });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

heroesRouter.put("/occupation", AuthMiddleware, async (req, res) => {
  try {
    const hero = await updateHeroOccupation(
      req.query.hero_id,
      req.query.occupation
    );
    res.json({ hero });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default heroesRouter;
