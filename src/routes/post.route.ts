import { Router } from "express";
import PostController from "../controllers/post.controller";
import PostValidation from "../middlewares/post.validation";

const postRouter = Router();

postRouter.get(
  "/",
  [PostValidation.validateGetPostsQuery],
  PostController.getPosts
);

postRouter.get(
  "/:postId",
  [PostValidation.validatePostId],
  PostController.getPostById
);

export default postRouter;
