import config from "config";
import express from "express";
import authRouter from "./routes/AuthRoutes";
import buildingRouter from "./routes/BuildingRoutes";
import heroRouter from "./routes/HeroRoutes";
import questRouter from "./routes/QuestRoutes";
import shopRouter from "./routes/ShopRoutes";
import statsRouter from "./routes/StatsRoutes";

const server = express();

server.use(express.json());

server.use("/api/ping", async (_, res) => {
  res.json({ message: "ok" });
});

server.use("/api/auth", authRouter);
server.use("/api/hero", heroRouter);
server.use("/api/building", buildingRouter);
server.use("/api/stats", statsRouter);
server.use("/api/quest", questRouter);
server.use("/api/shop", shopRouter);

const port = config.get("serverPort");
server.listen(port, () => console.log(`Server has been running on port ${port}...`));
