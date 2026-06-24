import AppError from "../errors/AppError";
import CommentRepository from "../repositories/comment.repository";
import PostRepository from "../repositories/post.repository";

const CommentService = {
  createComment: async (postId: number, userId: string, comment: string) => {
    const lookup = {
      post: await PostRepository.getById(postId),
    };

    if (!lookup.post) {
      throw new AppError("Post not found", 404);
    }

    await CommentRepository.create(postId, userId, comment);
  },
};

export default CommentService;
