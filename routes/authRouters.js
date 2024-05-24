import express from "express";

import {
  registration,
  login,
  logout,
  current,
} from "../controllers/authControllers.js";

import { getAvatar, uploadAvatar } from "../controllers/avatarsControllers.js";

import authMiddleware from "../middlewares/authenticate.js";
import uploadMiddleware from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", registration);
authRouter.post("/login", login);
authRouter.get("/current", authMiddleware, current);
authRouter.post("/logout", authMiddleware, logout);
authRouter.patch(
  "/avatar",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  uploadAvatar
);
authRouter.get("/avatar", authMiddleware, getAvatar);

export default authRouter;
