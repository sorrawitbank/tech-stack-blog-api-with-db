import { Router } from "express";
import PostController from "../controllers/post.controller";
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
