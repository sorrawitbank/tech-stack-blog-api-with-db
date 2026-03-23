import { Router } from "express";
import PostController from "../controllers/post.controller";
import PostValidation from "../middlewares/post.validation";
import UserValidation from "../middlewares/user.validation";

const postRouter = Router();

postRouter.get(
  "/",
  PostValidation.validateGetPostsQuery,
  PostController.getPosts
);

postRouter.get(
  "/:postId",
  PostValidation.validatePostId,
  PostController.getPostById
);

postRouter.post(
  "/",
  UserValidation.validateUserId,
  PostValidation.validatePostBody,
  PostController.createPost
);

postRouter.put(
  "/:postId",
  PostValidation.validatePostId,
  PostValidation.validatePostBody,
  PostController.updatePost
);

postRouter.delete(
  "/:postId",
  PostValidation.validatePostId,
  PostController.deletePost
);

export default postRouter;
