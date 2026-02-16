import { Router } from "express";
import AuthController from "../controllers/authController";
import AuthValidation from "../middlewares/authValidation";

const authRoute = Router();

authRoute.get("/get-user", AuthController.getUser);

authRoute.post("/register", AuthValidation.register, AuthController.register);

authRoute.post("/login", AuthValidation.login, AuthController.login);

authRoute.put(
  "/reset-password",
  AuthValidation.resetPassword,
  AuthController.resetPassword
);

export default authRoute;
