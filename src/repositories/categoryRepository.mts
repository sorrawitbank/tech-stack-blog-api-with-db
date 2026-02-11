import db from "../db/db.ts";
import { categories } from "../db/schema.ts";

const CategoryRepository = {
  get: async () => {
    return await db.select().from(categories);
  },
};

export default CategoryRepository;
