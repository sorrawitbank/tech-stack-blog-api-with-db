import type { NextFunction, Request, Response } from "express";
import type { UserIdBody } from "../types/body.ts";
import { validate as isValidUUID } from "uuid";

const UserValidation = {
  validateUserId: (
    req: Request<{}, {}, Partial<UserIdBody>>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.body) {
      return res.status(400).json({ message: "Body is required" });
    }

    const { userId } = req.body;

    // Check for required fields
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Type validations
    if (!isValidUUID(userId)) {
      return res.status(400).json({ message: "User ID must be a UUID" });
    }

    next();
  },
};

export default UserValidation;
