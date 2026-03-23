import type { NextFunction, Request, Response } from "express";
import type { AdminUserBody, UserBody } from "../types/body";

const UserValidation = {
  validateUserBody: (
    req: Request<{}, {}, { body: string }>, //Partial<PostBody>>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.body?.body) {
      return res.status(400).json({ error: "Body is required" });
    }

    let body: Partial<UserBody>;

    try {
      body = JSON.parse(req.body.body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON body" });
    }

    const { name, username } = body;

    // Check for required fields
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Type validations
    if (typeof name !== "string") {
      return res.status(400).json({ message: "Name must be a string" });
    }

    if (typeof username !== "string") {
      return res.status(400).json({ message: "Username must be a string" });
    }

    next();
  },

  validateAdminBody: (
    req: Request<{}, {}, { body: string }>, //Partial<PostBody>>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.body?.body) {
      return res.status(400).json({ error: "Body is required" });
    }

    let body: Partial<AdminUserBody>;

    try {
      body = JSON.parse(req.body.body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON body" });
    }

    const { name, username, bio } = body;

    // Check for required fields
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Type validations
    if (typeof name !== "string") {
      return res.status(400).json({ message: "Name must be a string" });
    }

    if (typeof username !== "string") {
      return res.status(400).json({ message: "Username must be a string" });
    }

    if (bio !== undefined) {
      if (typeof bio !== "string") {
        return res.status(400).json({ message: "Bio must be a string" });
      }

      if (bio.trim().length > 120) {
        return res.status(400).json({
          error: "Bio must be less than 120 characters long",
        });
      }
    }

    next();
  },
};

export default UserValidation;
