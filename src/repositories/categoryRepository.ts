import db from "../db/db";
import { categories } from "../db/schema";

const CategoryRepository = {
  get: async () => {
    return await db.select().from(categories);
  },
};

export default CategoryRepository;
