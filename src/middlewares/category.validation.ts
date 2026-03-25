import type { NextFunction, Request, Response } from "express";
import type { CategoryBody } from "../types/body";
import type { CategoryIdParams } from "../types/params";

const CategoryValidation = {
  validateCategoryId: (
    req: Request<CategoryIdParams>,
    res: Response,
    next: NextFunction
  ) => {
    const { categoryId } = req.params;
    const parsedCategoryId = Number(categoryId);

    if (!parsedCategoryId && parsedCategoryId !== 0) {
      return res.status(400).json({ message: "Category ID must be a number" });
    }

    if (parsedCategoryId <= 0) {
      return res.status(400).json({
        message: "Category ID must be a positive number",
      });
    }

    next();
  },

  validateCategoryBody: (
    req: Request<{}, {}, Partial<CategoryBody>>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.body) {
      return res.status(400).json({ message: "Body is required" });
    }

    const { name } = req.body;

    // Check for required fields
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Type validations
    if (typeof name !== "string") {
      return res.status(400).json({ message: "Name must be a string" });
    }

    if (name.length < 2) {
      return res.status(400).json({
        message: "Name must be at least 2 characters long",
      });
    }

    if (name.length > 20) {
      return res.status(400).json({
        message: "Name must be less than 20 characters long",
      });
    }

    next();
  },
};

export default CategoryValidation;
