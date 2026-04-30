import type { NextFunction, Request, Response } from "express";
import type { User } from "@supabase/supabase-js";
import supabaseClient from "../supabase/client";

type RequestWithUser = Request & { user?: User };

async function protectUser(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  try {
    const { data, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !data.user) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = { ...data.user };
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }

  next();
}

export default protectUser;
