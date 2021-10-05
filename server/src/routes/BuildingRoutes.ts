import { Router } from "express";
import AuthMiddleware from "../middleware/AuthMiddleware";
import { getBuildings } from "../repository/Building";

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

export default buildingRouter;
