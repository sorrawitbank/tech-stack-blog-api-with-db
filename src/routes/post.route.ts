import { Router } from "express";
import CommentController from "../controllers/comment.controller";
import PostController from "../controllers/post.controller";
import CommentValidation from "../middlewares/comment.validation";
import protectUser from "../middlewares/protect.user";
import PostValidation from "../middlewares/post.validation";

const postRouter = Router();

postRouter.get(
  "/",
  [PostValidation.validateGetPostsQuery],
  PostController.getPublishedPosts
);

postRouter.get(
  "/:postId",
  [PostValidation.validatePostId],
  PostController.getPublishedPostById
);

postRouter.get(
  "/:postId/like",
  [PostValidation.validatePostId, protectUser],
  PostController.getPostLikeByUserId
);

postRouter.put(
  "/:postId/comment",
  [
    PostValidation.validatePostId,
    CommentValidation.validateCommentBody,
    protectUser,
  ],
  CommentController.createComment
);

postRouter.patch(
  "/:postId/like",
  [PostValidation.validatePostId, protectUser],
  PostController.likePost
);

postRouter.patch(
  "/:postId/unlike",
  [PostValidation.validatePostId, protectUser],
  PostController.unlikePost
);

export default postRouter;
