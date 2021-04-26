import express from "express";
import config from "config";
import pingRouter from "./routes/ping-routes.js";
import authRouter from "./routes/auth-routes.js";

const server = express();

server.use(express.json({ extended: true }));

server.use("/api", pingRouter);
server.use("/api/auth", authRouter);

const port = config.get("serverPort") || 8081;
server.listen(port, () =>
  console.log(`Server has been running on port ${port}...`)
);
