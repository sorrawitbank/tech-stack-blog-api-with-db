import { Router } from "express";
import UserController from "../controllers/user.controller";
import protectUser from "../middlewares/protect.user";
import UploadValidation from "../middlewares/upload.validation";
import UserValidation from "../middlewares/user.validation";

const userRouter = Router();

userRouter.use(protectUser);

userRouter.put(
  "/profile",
  [UploadValidation.image.single("image"), UserValidation.validateUserBody],
  UserController.updateUser
);

export default userRouter;
