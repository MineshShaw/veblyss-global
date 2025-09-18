import express from "express";
import { getCurrentUser, editCurrentUser, updateUserAddress, updateUserWishlist, updateUserCart } from "../controllers/user.controller.js";
import isAuth from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.patch("/update-profile", isAuth, editCurrentUser);
userRouter.patch("/update-address", isAuth, updateUserAddress);
userRouter.patch("/update-wishlist", isAuth, updateUserWishlist);
userRouter.patch("/update-cart", isAuth, updateUserCart);

export default userRouter;