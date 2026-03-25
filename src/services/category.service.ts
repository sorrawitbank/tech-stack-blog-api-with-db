import AppError from "../errors/AppError";
import CategoryRepository from "../repositories/category.repository";

const CategoryService = {
  getCategories: async () => {
    return CategoryRepository.get();
  },

  createCategory: async (name: string) => {
    const lookup = {
      category: (await CategoryRepository.getByName(name))[0],
    };

    if (lookup.category) {
      throw new AppError("Category already exists", 400);
    }

    return CategoryRepository.create(name);
  },

  updateCategory: async (categoryId: number, name: string) => {
    const lookup = {
      category: (await CategoryRepository.getByName(name))[0],
    };

    if (lookup.category) {
      throw new AppError("Category already exists", 400);
    }

    return CategoryRepository.update(categoryId, name);
  },

  deleteCategory: async (categoryId: number) => {
    return CategoryRepository.delete(categoryId);
  },
};

export default CategoryService;
