import { Router } from "express";
import CategoryController from "../controllers/category.controller";
import PostController from "../controllers/post.controller";
import UserController from "../controllers/user.controller";
import CategoryValidation from "../middlewares/category.validation";
import protectAdmin from "../middlewares/protect.admin";
import PostValidation from "../middlewares/post.validation";
import UploadValidation from "../middlewares/upload.validation";
import UserValidation from "../middlewares/user.validation";

const adminRouter = Router();

adminRouter.use(protectAdmin);

adminRouter.post(
  "/categories",
  [CategoryValidation.validateCategoryBody],
  CategoryController.createCategory
);

adminRouter.post(
  "/post",
  [PostValidation.validatePostBody],
  PostController.createPost
);

adminRouter.put(
  "/profile",
  [UploadValidation.image.single("image"), UserValidation.validateAdminBody],
  UserController.updateAdmin
);

adminRouter.put(
  "/categories/:categoryId",
  [
    CategoryValidation.validateCategoryId,
    CategoryValidation.validateCategoryBody,
  ],
  CategoryController.updateCategory
);

adminRouter.put(
  "/posts/:postId",
  [PostValidation.validatePostId, PostValidation.validatePostBody],
  PostController.updatePost
);

adminRouter.delete(
  "/categories/:categoryId",
  [CategoryValidation.validateCategoryId],
  CategoryController.deleteCategory
);

adminRouter.delete(
  "/posts/:postId",
  [PostValidation.validatePostId],
  PostController.deletePost
);

export default adminRouter;
