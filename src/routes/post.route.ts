import { Router } from "express";
import PostController from "../controllers/post.controller";
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

export default postRouter;
