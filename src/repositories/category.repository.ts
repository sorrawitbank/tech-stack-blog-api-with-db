import { asc, eq } from "drizzle-orm";
import db from "../db/db";
import { categories } from "../db/schema";

const CategoryRepository = {
  get: async () => {
    return db.select().from(categories).orderBy(asc(categories.id));
  },

  getByName: async (name: string) => {
    return db.select().from(categories).where(eq(categories.name, name));
  },

  create: async (name: string) => {
    await db.insert(categories).values({ name });
  },

  update: async (categoryId: number, name: string) => {
    return db
      .update(categories)
      .set({ id: categoryId, name })
      .where(eq(categories.id, categoryId));
  },

  delete: async (categoryId: number) => {
    return db.delete(categories).where(eq(categories.id, categoryId));
  },
};

export default CategoryRepository;
