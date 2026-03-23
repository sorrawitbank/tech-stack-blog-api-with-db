import type { NextFunction, Request, Response } from "express";
import UserRepository from "../repositories/user.repository";
import supabaseClient from "../supabase/client";

async function protectAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  try {
    const { data, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !data.user) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const result = (await UserRepository.getById(data.user.id))[0];

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = { ...data.user, role: result.role };

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden: You do not have admin access",
      });
    }
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }

  next();
}

export default protectAdmin;
