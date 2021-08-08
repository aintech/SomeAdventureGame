import config from "config";
import express from "express";
import authRouter from "./routes/AuthRoutes";
import heroesRouter from "./routes/HeroesRoutes";
import questsRouter from "./routes/QuestRoutes";
import shopsRouter from "./routes/ShopsRoutes";
import statsRouter from "./routes/StatsRoutes";

const server = express();

server.use(express.json());

server.use("/api/ping", async (_, res) => {
  res.json({ message: "ok" });
});

server.use("/api/auth", authRouter);
server.use("/api/heroes", heroesRouter);
server.use("/api/stats", statsRouter);
server.use("/api/quests", questsRouter);
server.use("/api/shops", shopsRouter);

const port = config.get("serverPort") || 8081;
server.listen(port, () => console.log(`Server has been running on port ${port}...`));
