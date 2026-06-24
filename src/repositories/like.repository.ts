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
};

export default LikeRepository;
