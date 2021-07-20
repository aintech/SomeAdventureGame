import { Router } from "express";
import AuthMiddleware from "../middleware/AuthMiddleware";
import { updateHeroActivities } from "../repository/hero/HeroActivity";
import { dismissHero, getHeroes, hireHero } from "../repository/hero/Hero";
import { getStats } from "../repository/Stats";
import { getTavernPatrons } from "../repository/TavernPatrons";

const heroesRouter = Router();

heroesRouter.get("/", AuthMiddleware, async (req, res) => {
  const user_id = Number(req.query.user_id as string);
  try {
    const heroes = await getHeroes(user_id);
    res.json(heroes);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

heroesRouter.get("/tavern", AuthMiddleware, async (req, res) => {
  const user_id = Number(req.query.user_id as string);
  try {
    const tavernPatrons = await getTavernPatrons(user_id);
    res.json(tavernPatrons);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

heroesRouter.put("/hire", AuthMiddleware, async (req, res) => {
  const user_id = Number(req.query.user_id as string);
  const hero_id = Number(req.query.hero_id as string);
  try {
    const hired = (await hireHero(user_id, hero_id))[0];
    const stats = await getStats(user_id);
    res.json({ stats, hired });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

heroesRouter.put("/dismiss", AuthMiddleware, async (req, res) => {
  const hero_id = Number(req.query.hero_id as string);
  try {
    dismissHero(hero_id);
    res.json({ heroId: hero_id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

heroesRouter.put("/activity", AuthMiddleware, async (req, res) => {
  const user_id = Number(req.query.user_id as string);
  try {
    const heroes = await updateHeroActivities(user_id, req.body);
    res.json(heroes);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default heroesRouter;
