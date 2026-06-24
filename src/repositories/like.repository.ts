import { and, eq } from "drizzle-orm";
import db from "../db/db";
import { likes } from "../db/schema";

const LikeRepository = {
  getByPostIdAndUserId: async (postId: number, userId: string) => {
    return db
      .select()
      .from(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
  },

  like: async (postId: number, userId: string) => {
    await db.insert(likes).values({ postId, userId });
  },

  unlike: async (postId: number, userId: string) => {
    return db
      .delete(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
  },
};

export default LikeRepository;
