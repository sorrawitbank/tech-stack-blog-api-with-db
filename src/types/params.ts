import { ParamsDictionary } from "express-serve-static-core";

export interface PostIdParams extends ParamsDictionary {
  postId: string;
}

export interface CategoryIdParams {
  categoryId: string;
}
