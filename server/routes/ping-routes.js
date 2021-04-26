import { Router } from "express";

const pingRouter = Router();

pingRouter.get("/ping", async (_, res) => {
  res.json({ message: "ping" });
});

export default pingRouter;
