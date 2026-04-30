import type { NextFunction, Request, Response } from "express";
import type { PostBody } from "../types/body";
import type { PostIdParams } from "../types/params";
import type { GetPostsQuery } from "../types/query";

const PostValidation = {
  validatePostId: (
    req: Request<PostIdParams>,
    res: Response,
    next: NextFunction
  ) => {
    const { postId } = req.params;
    const parsedPostId = Number(postId);

    if (!Number.isInteger(parsedPostId) || parsedPostId <= 0) {
      return res.status(400).json({
        message: "Post ID must be a positive integer",
      });
    }

    next();
  },

  validatePostBody: (
    req: Request<{}, {}, { body: string }>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.body?.body) {
      return res.status(400).json({ message: "Body is required" });
    }

    let body: Partial<PostBody>;

    try {
      body = JSON.parse(req.body.body);
    } catch {
      return res.status(400).json({ message: "Invalid JSON body" });
    }

    const { imageAlt, categoryIds, title, description, content, statusId } =
      body;

    // Check for required fields
    if (!categoryIds) {
      return res.status(400).json({ message: "Category IDs are required" });
    }

    if (!title) {
      return res.status(400).json({ message: " " });
    }

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    if (!statusId) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Type validations
    if (imageAlt) {
      if (typeof imageAlt !== "string") {
        return res.status(400).json({
          message: "Image alternative text must be a string",
        });
      }

      if (imageAlt.trim().length < 4) {
        return res.status(400).json({
          message: "Image alternative text must be at least 4 characters long",
        });
      }

      if (imageAlt.trim().length > 40) {
        return res.status(400).json({
          message:
            "Image alternative text must be less than 40 characters long",
        });
      }
    }

    if (!Array.isArray(categoryIds)) {
      return res.status(400).json({ message: "Category IDs must be an array" });
    }

    if (categoryIds.length > 3) {
      return res.status(400).json({
        message: "Category IDs must be an array of up to 3 numbers",
      });
    }

    for (const categoryId of categoryIds) {
      if (typeof categoryId !== "number") {
        return res.status(400).json({
          message: "Category IDs must be an array of numbers",
        });
      }
    }

    if (typeof title !== "string") {
      return res.status(400).json({ message: "Title must be a string" });
    }

    if (title.trim().length < 10) {
      return res.status(400).json({
        message: "Title must be at least 10 characters long",
      });
    }

    if (title.trim().length > 80) {
      return res.status(400).json({
        message: "Title must be less than 80 characters long",
      });
    }

    if (typeof description !== "string") {
      return res.status(400).json({
        message: "Description must be a string",
      });
    }

    if (description.trim().length < 20) {
      return res.status(400).json({
        message: "Description must be at least 20 characters long",
      });
    }

    if (description.trim().length > 400) {
      return res.status(400).json({
        message: "Description must be less than 400 characters long",
      });
    }

    if (typeof content !== "string") {
      return res.status(400).json({ message: "Content must be a string" });
    }

    if (content.trim().length < 40) {
      return res.status(400).json({
        message: "Content must be at least 40 characters long",
      });
    }

    if (
      typeof statusId !== "number" &&
      !(Number.isInteger(statusId) && statusId > 0)
    ) {
      return res.status(400).json({
        message: "Status ID must be a positive integer",
      });
    }

    next();
  },

  validateGetPostsQuery: (
    req: Request<{}, {}, {}, GetPostsQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const { page, limit, statusId } = req.query;
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const parsedStatusId = Number(statusId);

    if (
      page !== undefined &&
      !(Number.isInteger(parsedPage) && parsedPage > 0)
    ) {
      return res.status(400).json({
        message: "Page must be positive integer",
      });
    }

    if (
      limit !== undefined &&
      !(Number.isInteger(parsedLimit) && parsedLimit > 0)
    ) {
      return res.status(400).json({
        message: "Limit must be positive integer",
      });
    }

    if (
      statusId !== undefined &&
      !(Number.isInteger(parsedStatusId) && parsedStatusId > 0)
    ) {
      return res.status(400).json({
        message: "Status ID must be a positive integer",
      });
    }

    next();
  },
};

export default PostValidation;
