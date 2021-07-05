import { Router } from "express";
import AuthMiddleware from "../middleware/auth-middleware.js";
import { updateHeroActivities } from "../repository/hero-activity.js";
import { getHeroes, hireHero } from "../repository/hero.js";
import { getStats } from "../repository/stats.js";
import { getTavernPatrons } from "../repository/tavern-patrons.js";

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

heroesRouter.put("/activity", AuthMiddleware, async (req, res) => {
  try {
    const heroes = await updateHeroActivities(req.query.user_id, req.body);
    res.json(heroes);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default heroesRouter;
