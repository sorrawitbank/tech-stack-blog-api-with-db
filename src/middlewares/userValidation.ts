import type { NextFunction, Request, Response } from "express";
import type { UserIdBody } from "../types/body";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const UserValidation = {
  validateUserId: async (
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
    if (!uuidRegex.test(userId)) {
      return res.status(400).json({ message: "User ID must be a UUID" });
    }

    next();
  },
};

export default UserValidation;
