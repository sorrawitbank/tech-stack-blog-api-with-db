import { ParamsDictionary } from "express-serve-static-core";

export interface CategoryIdParams {
  categoryId: string;
}

export interface PostIdParams extends ParamsDictionary {
  postId: string;
}
