import { Router } from "express";
import PostController from "../controllers/post.controller";
import protectAdmin from "../middlewares/protect.admin";
import PostValidation from "../middlewares/post.validation";

const adminRouter = Router();

adminRouter.use(protectAdmin);

adminRouter.post(
  "/",
  [PostValidation.validatePostBody],
  PostController.createPost
);

adminRouter.put(
  "/:postId",
  [PostValidation.validatePostId, PostValidation.validatePostBody],
  PostController.updatePost
);

adminRouter.delete(
  "/:postId",
  [PostValidation.validatePostId],
  PostController.deletePost
);

export default adminRouter;
