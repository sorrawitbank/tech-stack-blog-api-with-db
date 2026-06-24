import type { Request, Response } from "express";
import type { PostBody } from "../types/body";
import type { PostIdParams } from "../types/params";
import type { GetPostsQuery } from "../types/query";
import AppError from "../errors/AppError";
import AuthService from "../services/auth.service";
import PostService from "../services/post.service";

const PostController = {
  getPosts: async (req: Request<{}, {}, {}, GetPostsQuery>, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const category = req.query.category;
    const keyword = req.query.keyword;
    const statusId = Number(req.query.statusId) || null;
    let result;

    try {
      result = await PostService.getPosts(
        page,
        limit,
        category ? category.trim() : null,
        keyword ? keyword.trim() : null,
        statusId
      );
    } catch {
      return res.status(500).json({
        message: "Server could not read posts because of database connection",
      });
    }

    const postResponse = {
      totalPosts: result.totalPosts,
      totalPages: result.totalPages,
      currentPage: page,
      limit: limit,
      posts: result.posts.map((post) => ({
        id: post.id,
        author: post.author,
        image: post.image,
        imageAlt: post.imageAlt,
        categories: post.categories,
        title: post.title,
        description: post.description,
        content: post.content,
        status: post.status,
        createdAt: post.createdAt,
      })),
    };

    return res.status(200).json(postResponse);
  },

  getPublishedPosts: async (
    req: Request<{}, {}, {}, GetPostsQuery>,
    res: Response
  ) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const category = req.query.category;
    const keyword = req.query.keyword;
    let result;

    try {
      result = await PostService.getPosts(
        page,
        limit,
        category ? category.trim() : null,
        keyword ? keyword.trim() : null,
        2
      );
    } catch {
      return res.status(500).json({
        message: "Server could not read posts because of database connection",
      });
    }

    const postResponse = {
      totalPosts: result.totalPosts,
      totalPages: result.totalPages,
      currentPage: page,
      limit: limit,
      posts: result.posts.map((post) => ({
        id: post.id,
        author: post.author,
        image: post.image,
        imageAlt: post.imageAlt,
        categories: post.categories,
        title: post.title,
        description: post.description,
        content: post.content,
        status: post.status,
        createdAt: post.createdAt,
      })),
    };

    return res.status(200).json(postResponse);
  },

  getPostById: async (req: Request<PostIdParams>, res: Response) => {
    const postId = Number(req.params.postId);
    let result;

    try {
      result = await PostService.getPostById(postId, false);
    } catch {
      return res.status(500).json({
        message: "Server could not read post because of database connection",
      });
    }

    if (!result) {
      return res.status(404).json({
        message: "Server could not find a requested post to read",
      });
    }

    const postResponse = {
      id: result.id,
      author: result.author,
      image: result.image,
      imageAlt: result.imageAlt,
      categories: result.categories,
      title: result.title,
      description: result.description,
      content: result.content,
      status: result.status,
      createdAt: result.createdAt,
    };

    return res.status(200).json(postResponse);
  },

  getPublishedPostById: async (req: Request<PostIdParams>, res: Response) => {
    const postId = Number(req.params.postId);
    let result;

    try {
      result = await PostService.getPostById(postId);
    } catch {
      return res.status(500).json({
        message: "Server could not read post because of database connection",
      });
    }

    if (!result) {
      return res.status(404).json({
        message: "Server could not find a requested post to read",
      });
    }

    const postResponse = {
      id: result.id,
      author: result.author,
      image: result.image,
      imageAlt: result.imageAlt,
      categories: result.categories,
      title: result.title,
      description: result.description,
      content: result.content,
      status: result.status,
      createdAt: result.createdAt,
      likes: result.likes,
      comments: result.comments,
    };

    return res.status(200).json(postResponse);
  },

  getPostLikeByUserId: async (req: Request<PostIdParams>, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const postId = Number(req.params.postId);
    let result;

    try {
      const user = await AuthService.getUser(token);

      result = await PostService.getPostLikeByUserId(postId, user.data.user.id);
    } catch (error) {
      // Client error from service
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({
        message:
          "Server could not read post like because of database connection",
      });
    }

    return res.status(200).json(result);
  },

  createPost: async (req: Request<{}, {}, { body: string }>, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const body: PostBody = JSON.parse(req.body.body);
    const { imageAlt, categoryIds, title, description, content, statusId } =
      body;
    const file = req.file!;

    try {
      const user = await AuthService.getUser(token);

      await PostService.createPost(
        user.data.user.id,
        imageAlt ? imageAlt.trim() : null,
        [...new Set(categoryIds)],
        title.trim(),
        description.trim(),
        content.trim(),
        statusId,
        file
      );
    } catch (error) {
      // Client error from service (e.g. User/Status/Category not found)
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({
        message: "Server could not create post because of database connection",
      });
    }

    return res.status(201).json({ message: "Created post sucessfully" });
  },

  updatePost: async (
    req: Request<PostIdParams, {}, { body: string }>,
    res: Response
  ) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const postId = Number(req.params.postId);
    const body: PostBody = JSON.parse(req.body.body);
    const { imageAlt, categoryIds, title, description, content, statusId } =
      body;
    const file = req.file;
    let result;

    try {
      const user = await AuthService.getUser(token);

      result = await PostService.updatePost(
        user.data.user.id,
        postId,
        imageAlt ? imageAlt.trim() : null,
        [...new Set(categoryIds)],
        title.trim(),
        description.trim(),
        content.trim(),
        statusId,
        file
      );
    } catch (error) {
      // Client error from service (e.g. Status/Category not found)
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({
        message: "Server could not update post because of database connection",
      });
    }

    if (!result.rowCount) {
      return res.status(404).json({
        message: "Server could not find a requested post to update",
      });
    }

    return res.status(200).json({ message: "Updated post successfully" });
  },

  likePost: async (req: Request<PostIdParams>, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const postId = Number(req.params.postId);

    try {
      const user = await AuthService.getUser(token);

      await PostService.likePost(postId, user.data.user.id);
    } catch (error) {
      // Client error from service
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({
        message: "Server could not like post because of database connection",
      });
    }

    return res.status(200).json({ message: "Liked post successfully" });
  },

  unlikePost: async (req: Request<PostIdParams>, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const postId = Number(req.params.postId);
    let result;

    try {
      const user = await AuthService.getUser(token);

      result = await PostService.unlikePost(postId, user.data.user.id);
    } catch (error) {
      // Client error from service
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({
        message: "Server could not unlike post because of database connection",
      });
    }

    if (!result.rowCount) {
      return res.status(404).json({
        message: "This user did not like this post",
      });
    }

    return res.status(200).json({ message: "Unliked post successfully" });
  },

  deletePost: async (req: Request<PostIdParams>, res: Response) => {
    const postId = Number(req.params.postId);
    let result;

    try {
      result = await PostService.deletePost(postId);
    } catch {
      return res.status(500).json({
        message: "Server could not delete post because of database connection",
      });
    }

    if (!result.rowCount) {
      return res.status(404).json({
        message: "Server could not find a requested post to delete",
      });
    }

    return res.status(200).json({ message: "Deleted post successfully" });
  },
};

export default PostController;
