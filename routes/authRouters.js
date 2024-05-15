import express from "express";

import {registration, login} from "../controllers/authControllers.js";



const authRouter = express.Router();

authRouter.post("/register", registration);
authRouter.post("/login", login);

export default authRouter;
