import type { Request, Response } from "express";
import type { LoginBody, RegisterBody, ResetPasswordBody } from "../types/body";
import AppError from "../errors/AppError";
import AuthService from "../services/auth.service";

const AuthController = {
  register: async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    const { name, username, email, password } = req.body;

    try {
      await AuthService.register(name.trim(), username.trim(), email, password);
    } catch (error) {
      // Client error from service
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({
        message: "An error occurred during registration",
      });
    }

    return res.status(201).json({ message: "User created successfully" });
  },

  login: async (req: Request<{}, {}, LoginBody>, res: Response) => {
    const { email, password } = req.body;
    let accessToken;

    try {
      accessToken = await AuthService.login(email, password);
    } catch (error) {
      // Client error from service
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({
        message: "An error occurred during login",
      });
    }

    return res.status(200).json({
      message: "Logged in successfully",
      accessToken,
    });
  },

  getUser: async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    let result;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    try {
      result = await AuthService.getUser(token);
    } catch (error) {
      // Client error from service
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: "Internal server error" });
    }

    const userResponse = {
      id: result.data.user.id,
      email: result.data.user.email!,
      username: result.user.username,
      name: result.user.name,
      bio: result.user.bio,
      profilePic: result.user.profilePic,
      role: result.user.role,
    };

    return res.status(200).json(userResponse);
  },

  resetPassword: async (
    req: Request<{}, {}, ResetPasswordBody>,
    res: Response
  ) => {
    const token = req.headers.authorization?.split(" ")[1];
    const { oldPassword, newPassword } = req.body;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    try {
      await AuthService.resetPassword(token, oldPassword, newPassword);
    } catch (error) {
      // Client error from service
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: "Internal server error" });
    }

    return res.status(200).json({ message: "Password updated successfully" });
  },
};

export default AuthController;
