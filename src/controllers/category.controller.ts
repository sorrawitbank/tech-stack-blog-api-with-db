import type { Request, Response } from "express";
import type { CategoryBody } from "../types/body";
import type { CategoryIdParams } from "../types/params";
import AppError from "../errors/AppError";
import CategoryService from "../services/category.service";

const CategoryController = {
  getCategories: async (req: Request, res: Response) => {
    let result;

    try {
      result = await CategoryService.getCategories();
    } catch {
      return res.status(500).json({
        message:
          "Server could not read categories because of database connection",
      });
    }

    const categoryResponse = result.map((category) => ({
      id: category.id,
      name: category.name,
    }));

    return res.status(200).json(categoryResponse);
  },

  createCategory: async (req: Request<{}, {}, CategoryBody>, res: Response) => {
    const { name } = req.body;

    try {
      await CategoryService.createCategory(name);
    } catch (error) {
      // Client error from service
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({
        message:
          "Server could not create category because of database connection",
      });
    }

    return res.status(201).json({ message: "Category created successfully" });
  },

  updateCategory: async (
    req: Request<CategoryIdParams, {}, CategoryBody>,
    res: Response
  ) => {
    const categoryId = Number(req.params.categoryId);
    const { name } = req.body;
    let result;

    try {
      result = await CategoryService.updateCategory(categoryId, name);
    } catch (error) {
      // Client error from service
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({
        message:
          "Server could not update category because of database connection",
      });
    }

    if (!result.rowCount) {
      return res.status(404).json({
        message: "Server could not find a requested category to update",
      });
    }

    return res.status(200).json({ message: "Category updated successfully" });
  },

  deleteCategory: async (req: Request<CategoryIdParams>, res: Response) => {
    const categoryId = Number(req.params.categoryId);
    let result;

    try {
      result = await CategoryService.deleteCategory(categoryId);
    } catch {
      return res.status(500).json({
        message:
          "Server could not delete category because of database connection",
      });
    }

    if (!result.rowCount) {
      return res.status(404).json({
        message: "Server could not find a requested category to delete",
      });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  },
};

export default CategoryController;
