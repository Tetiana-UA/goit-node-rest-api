import express from "express";

import {
  registration,
  login,
  logout,
  current,
} from "../controllers/authControllers.js";

import {
  uploadAvatar,
  verifyEmail,
  resendVerifyEmail,
} from "../controllers/userControllers.js";

import authMiddleware from "../middlewares/authenticate.js";
import uploadMiddleware from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", registration);
authRouter.get("/verify/:token", verifyEmail);
authRouter.post("/verify", resendVerifyEmail);
authRouter.post("/login", login);
authRouter.get("/current", authMiddleware, current);
authRouter.post("/logout", authMiddleware, logout);
authRouter.patch(
  "/avatar",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  uploadAvatar
);

export default authRouter;
