import express from "express";
import { getCurrentUser, editCurrentUser } from "../controllers/user.controller.js";
import isAuth from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.patch("/update", isAuth, editCurrentUser);

export default userRouter;