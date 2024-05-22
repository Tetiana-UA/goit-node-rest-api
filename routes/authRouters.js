import express from "express";

import {
  registration,
  login,
  logout,
  current,
} from "../controllers/authControllers.js";
import authMiddleware from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", registration);
authRouter.post("/login", login);
authRouter.post("/current", authMiddleware, current);
authRouter.post("/logout", authMiddleware, logout);

export default authRouter;
