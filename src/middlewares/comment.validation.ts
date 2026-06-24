import type { NextFunction, Request, Response } from "express";
import type { CommentBody } from "../types/body";

const CommentValidation = {
  validateCommentBody: (
    req: Request<{}, {}, Partial<CommentBody>>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.body) {
      return res.status(400).json({ message: "Body is required" });
    }

    const { comment } = req.body;

    // Check for required fields
    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    // Type validations
    if (typeof comment !== "string") {
      return res.status(400).json({
        message: "Comment must be a string",
      });
    }

    if (comment.trim().length < 10) {
      return res.status(400).json({
        message: "Comment must be at least 10 characters long",
      });
    }

    if (comment.trim().length > 400) {
      return res.status(400).json({
        message: "Comment must be less than 400 characters long",
      });
    }

    next();
  },
};

export default CommentValidation;
