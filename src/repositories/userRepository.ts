import { eq } from "drizzle-orm";
import db from "../db/db";
import { users } from "../db/schema";

const UserRepository = {
  getById: async (userId: string) => {
    return await db.select().from(users).where(eq(users.id, userId));
  },
};

export default UserRepository;
