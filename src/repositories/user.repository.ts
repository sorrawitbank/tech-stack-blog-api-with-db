import { eq } from "drizzle-orm";
import db from "../db/db";
import { users } from "../db/schema";

const UserRepository = {
  getById: async (userId: string) => {
    return db.select().from(users).where(eq(users.id, userId));
  },

  getByUsername: async (username: string) => {
    return db.select().from(users).where(eq(users.username, username));
  },

  create: async (userId: string, username: string, name: string) => {
    await db.insert(users).values({ id: userId, name, username });
  },

  update: async (
    userId: string,
    name: string,
    username: string,
    profilePic: string | undefined,
    bio: string | undefined
  ) => {
    return db
      .update(users)
      .set({ name, username, profilePic, bio })
      .where(eq(users.id, userId));
  },
};

export default UserRepository;
