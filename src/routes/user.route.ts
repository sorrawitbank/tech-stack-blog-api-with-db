import { Router } from "express";
import UserController from "../controllers/user.controller";
import protectUser from "../middlewares/protect.user";
import UserValidation from "../middlewares/user.validation";

const userRouter = Router();

userRouter.use(protectUser);

userRouter.put(
  "/profile",
  [UserValidation.validateUserBody],
  UserController.updateUser
);

export default userRouter;
