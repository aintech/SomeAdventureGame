import config from "config";
import express from "express";
import authRouter from "./routes/auth-routes.js";
import heroesRouter from "./routes/heroes-routes.js";
import questsRouter from "./routes/quest-routes.js";
import statsRouter from "./routes/stats-routes.js";

const server = express();

server.use(express.json({ extended: true }));

server.use("/api/ping", async (_, res) => {
  res.json({ message: "ok" });
});

server.use("/api/auth", authRouter);
server.use("/api/heroes", heroesRouter);
server.use("/api/stats", statsRouter);
server.use("/api/quests", questsRouter);

const port = config.get("serverPort") || 8081;
server.listen(port, () =>
  console.log(`Server has been running on port ${port}...`)
);
