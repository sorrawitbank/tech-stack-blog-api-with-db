import { eq } from "drizzle-orm";
import db from "../db/db";
import { users } from "../db/schema";

const UserRepository = {
  getById: async (userId: string) => {
    return await db.select().from(users).where(eq(users.id, userId));
  },

  getByUsername: async (username: string) => {
    return await db.select().from(users).where(eq(users.username, username));
  },

  create: async (userId: string, username: string, name: string) => {
    await db.insert(users).values({ id: userId, name, username });
  },
};

export default UserRepository;
