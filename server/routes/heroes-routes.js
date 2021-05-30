import { Router } from "express";
import AuthMiddleware from "../middleware/auth-middleware.js";
import { getHeroes, hireHero } from "../repository/hero.js";
import { getTavernPatrons } from "../repository/tavern-patrons.js";
import { getStats } from "../repository/stats.js";

const heroesRouter = Router();

heroesRouter.get("/:userId", AuthMiddleware, async (req, res) => {
  try {
    const heroes = await getHeroes(req.params.userId);
    res.json(heroes);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

heroesRouter.get("/:userId/tavern", AuthMiddleware, async (req, res) => {
  try {
    const tavernPatrons = await getTavernPatrons(req.params.userId);
    res.json(tavernPatrons);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

heroesRouter.put("/:userId/hire/:heroId", AuthMiddleware, async (req, res) => {
  try {
    const hired = (await hireHero(req.params.userId, req.params.heroId))[0];
    const stats = await getStats(req.params.userId);
    res.json({ stats, hired });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default heroesRouter;
