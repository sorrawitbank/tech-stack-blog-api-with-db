import db from "../db/db";
import { comments } from "../db/schema";

const CommentRepository = {
  create: async (postId: number, userId: string, comment: string) => {
    await db.insert(comments).values({ postId, userId, commentText: comment });
  },
};

export default CommentRepository;
