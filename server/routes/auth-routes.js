import bcrypt from "bcryptjs";
import config from "config";
import { Router } from "express";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { getUser, saveUser, User } from "../models/user.js";

const authRouter = Router();

authRouter.post(
  "/register",
  [
    check("password", "Password must be 6 symbols minimum").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid registration credentials",
        });
      }

      const { login, password } = req.body;

      const candidate = await getUser(login);

      if (candidate) {
        return res
          .status(400)
          .json({ message: "User with such credentials already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User(null, login, hashedPassword);

      await saveUser(user);

      res.status(201).json({ message: "user registered" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

authRouter.post(
  "/login",
  [
    check("password", "Password must be 6 symbols minimum").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid login credentials",
        });
      }

      const { login, password } = req.body;

      const user = await getUser(login);

      if (!user) {
        return res.status(400).json({ message: "Such user is not exists" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "1h",
      });

      res.json({ token, userId: user.id });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Something goes very wrong, try again later" });
    }
  }
);

export default authRouter;
