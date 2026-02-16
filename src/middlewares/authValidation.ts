import type { NextFunction, Request, Response } from "express";
import type { LoginBody, RegisterBody, ResetPasswordBody } from "../types/body";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const AuthValidation = {
  register: (
    req: Request<{}, {}, Partial<RegisterBody>>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.body) {
      return res.status(400).json({ message: "Body is required" });
    }

    const { name, username, email, password } = req.body;

    // Check for required fields
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Type validations
    if (typeof name !== "string") {
      return res.status(400).json({ message: "Name must be a string" });
    }

    if (typeof username !== "string") {
      return res.status(400).json({ message: "Username must be a string" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (typeof password !== "string") {
      return res.status(400).json({ message: "Password must be a string" });
    }

    next();
  },

  login: (
    req: Request<{}, {}, Partial<LoginBody>>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.body) {
      return res.status(400).json({ message: "Body is required" });
    }

    const { email, password } = req.body;

    // Check for required fields
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Type validations
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (typeof password !== "string") {
      return res.status(400).json({ message: "Password must be a string" });
    }

    next();
  },

  resetPassword: (
    req: Request<{}, {}, Partial<ResetPasswordBody>>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.body) {
      return res.status(400).json({ message: "Body is required" });
    }

    const { oldPassword, newPassword } = req.body;

    // Check for required fields
    if (!oldPassword) {
      return res.status(400).json({ message: "Old password is required" });
    }

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    // Type validations
    if (typeof oldPassword !== "string") {
      return res.status(400).json({ message: "Old password must be a string" });
    }

    if (typeof newPassword !== "string") {
      return res.status(400).json({ message: "New password must be a string" });
    }

    next();
  },
};

export default AuthValidation;
