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

    if (!parsedPostId && parsedPostId !== 0) {
      return res.status(400).json({ message: "Post ID must be a number" });
    }

    if (parsedPostId <= 0) {
      return res.status(400).json({
        message: "Post ID must be a positive number",
      });
    }

    next();
  },

  validatePostBody: (
    req: Request<{}, {}, Partial<PostBody>>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.body) {
      return res.status(400).json({ message: "Body is required" });
    }

    const { image, imageAlt, categories, title, description, content, status } =
      req.body;

    // Check for required fields
    if (!image) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    if (!categories) {
      return res.status(400).json({ message: "Categories are required" });
    }

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Type validations
    if (typeof image !== "string") {
      return res.status(400).json({ message: "Image URL must be a string" });
    }

    if (imageAlt && typeof imageAlt !== "string") {
      return res.status(400).json({
        message: "Image alternative text must be a string",
      });
    }

    if (!Array.isArray(categories)) {
      return res.status(400).json({ message: "Categories must be an array" });
    }

    for (const category of categories) {
      if (typeof category !== "string") {
        return res.status(400).json({
          message: "Categories must be an array of strings",
        });
      }
    }

    if (typeof title !== "string") {
      return res.status(400).json({ message: "Title must be a string" });
    }

    if (typeof description !== "string") {
      return res.status(400).json({
        message: "Description must be a string",
      });
    }

    if (typeof content !== "string") {
      return res.status(400).json({ message: "Content must be a string" });
    }

    if (typeof status !== "string") {
      return res.status(400).json({ message: "Status must be a string" });
    }

    next();
  },

  validateGetPostsQuery: (
    req: Request<{}, {}, {}, GetPostsQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const { page, limit } = req.query;
    const parsedPage = Number(page);
    const parsedlimit = Number(limit);

    if (
      !(
        (typeof page === "undefined" || parsedPage > 0) &&
        (typeof limit === "undefined" || parsedlimit > 0)
      )
    ) {
      return res
        .status(400)
        .json({ message: "Page and limit must be positive numbers" });
    }

    next();
  },
};

export default PostValidation;
