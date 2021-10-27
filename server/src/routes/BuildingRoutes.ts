import { Router } from "express";
import AuthMiddleware from "../middleware/AuthMiddleware";
import { beginBuildingUpgrade, checkEnoughGoldForUpgrade, completeBuildingUpgrade, getBuildings } from "../repository/Building";
import { addStats, getStats } from "../repository/Stats";

const buildingRouter = Router();

buildingRouter.get("/", AuthMiddleware, async (req, res) => {
  const user_id = Number(req.query.user_id as string);
  try {
    const buildings = await getBuildings(user_id);
    res.json(buildings);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

buildingRouter.get("/upgrade", AuthMiddleware, async (req, res) => {
  const user_id = Number(req.query.user_id as string);
  const type = Number(req.query.type as string);
  try {
    const enoughCost = await checkEnoughGoldForUpgrade(user_id, type);
    if (enoughCost.enough) {
      await addStats(user_id, -enoughCost.cost);
      await beginBuildingUpgrade(user_id, type);
    }
    const stats = await getStats(user_id);
    const buildings = await getBuildings(user_id);
    res.json({ stats, buildings });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

//FIXME: Проверять что время апгрейда действительно прошло
buildingRouter.get("/complete", AuthMiddleware, async (req, res) => {
  const user_id = Number(req.query.user_id as string);
  const type = Number(req.query.type as string);
  try {
    await completeBuildingUpgrade(user_id, type);
    const buildings = await getBuildings(user_id);
    res.json(buildings);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

export default buildingRouter;
