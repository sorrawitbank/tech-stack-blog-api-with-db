import { format } from "date-fns";
import { UTCDate } from "@date-fns/utc";
import AppError from "../errors/AppError";
import CategoryRepository from "../repositories/category.repository";
import LikeRepository from "../repositories/like.repository";
import PostRepository from "../repositories/post.repository";
import StatusRepository from "../repositories/status.repository";
import supabaseClient from "../supabase/client";
import sanitizeFilename from "../utils/sanitizeFilename";

const bucket = "post-assets";

const PostService = {
  getPosts: async (
    page: number,
    limit: number,
    category: string | null,
    keyword: string | null,
    statusId: number | null
  ) => {
    const { result, totalPosts } = await PostRepository.get(
      page,
      limit,
      category,
      keyword,
      statusId
    );

    return {
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      posts: result.map((post) => ({
        ...post,
        author: {
          name: post.user.name,
          profilePic: post.user.profilePic,
        },
        categories: post.postCategories.map(
          (category) => category.category.name
        ),
        status: post.status.name,
      })),
    };
  },

  getPostById: async (postId: number, onlyPublished: boolean = true) => {
    const result = await PostRepository.getById(postId);

    if (!result) return;

    if (onlyPublished && result.statusId !== 2) return;

    return {
      ...result,
      author: {
        name: result.user.name,
        profilePic: result.user.profilePic,
      },
      categories: result.postCategories.map(
        (category) => category.category.name
      ),
      comments: result.comments.map((comment) => ({
        id: comment.id,
        user: {
          name: comment.user.name,
          profilePic: comment.user.profilePic,
        },
        commentText: comment.commentText,
        createdAt: comment.createdAt,
      })),
      likes: result.likes.length,
      status: result.status.name,
    };
  },

  getPostLikeByUserId: async (postId: number, userId: string) => {
    const lookup = {
      post: await PostRepository.getById(postId),
    };

    if (!lookup.post) {
      throw new AppError("Post not found", 404);
    }

    const result = await LikeRepository.getByPostIdAndUserId(postId, userId);

    return Boolean(result[0]);
  },

  createPost: async (
    userId: string,
    imageAlt: string | null,
    categoryIds: number[],
    title: string,
    description: string,
    content: string,
    statusId: number,
    file: Express.Multer.File
  ) => {
    const lookup = {
      statuses: await StatusRepository.get(),
      categories: await CategoryRepository.get(),
    };

    const lookupStatusIds = lookup.statuses.map((status) => status.id);
    if (!lookupStatusIds.includes(statusId)) {
      throw new AppError("Status not found", 404);
    }

    const lookupCategoryIds = lookup.categories.map((category) => category.id);
    const sortedCategoryIds = categoryIds.sort((a, b) => a - b);
    for (const categoryId of sortedCategoryIds) {
      if (!lookupCategoryIds.includes(categoryId)) {
        throw new AppError("Some categories not found", 404);
      }
    }

    let filePath: string | undefined;

    try {
      // Upload image
      const now = new UTCDate();
      const fileExt = file.mimetype.split("/")[1];
      const sanitizedTitle = sanitizeFilename(title);

      filePath = `${sanitizedTitle}-${format(
        now,
        "yyyyMMddHHmmss"
      )}.${fileExt}`;

      const { error } = await supabaseClient.storage
        .from(bucket)
        .upload(filePath, file.buffer, { contentType: file.mimetype });

      if (error) {
        throw error;
      }

      const { data } = supabaseClient.storage
        .from(bucket)
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      await PostRepository.create(
        userId,
        publicUrl,
        imageAlt,
        sortedCategoryIds,
        title,
        description,
        content,
        statusId
      );
    } catch {
      // Rollback
      if (filePath) {
        await supabaseClient.storage.from(bucket).remove([filePath]);
      }

      throw new AppError("Failed to create post", 500);
    }
  },

  updatePost: async (
    userId: string,
    postId: number,
    imageAlt: string | null,
    categoryIds: number[],
    title: string,
    description: string,
    content: string,
    statusId: number,
    file: Express.Multer.File | undefined
  ) => {
    const lookup = {
      posts: await PostRepository.getByUserId(userId),
      statuses: await StatusRepository.get(),
      categories: await CategoryRepository.get(),
    };

    const lookupPostIds = lookup.posts.map((post) => post.id);

    if (!lookupPostIds.includes(postId)) {
      throw new AppError("Post not found or not owned by user", 404);
    }

    const lookupStatusIds = lookup.statuses.map((status) => status.id);
    if (!lookupStatusIds.includes(statusId)) {
      throw new AppError("Status not found", 404);
    }

    const lookupCategoryIds = lookup.categories.map((category) => category.id);
    const sortedCategoryIds = categoryIds.sort((a, b) => a - b);
    for (const categoryId of sortedCategoryIds) {
      if (!lookupCategoryIds.includes(categoryId)) {
        throw new AppError("Some categories not found", 404);
      }
    }

    const post = lookup.posts.filter((post) => post.id === postId)[0];
    let filePath: string | undefined;

    try {
      let publicUrl: string | undefined;

      // Upload image
      if (file) {
        const now = new UTCDate();
        const fileExt = file.mimetype.split("/")[1];
        const sanitizedTitle = sanitizeFilename(title);

        filePath = `${sanitizedTitle}-${format(
          now,
          "yyyyMMddHHmmss"
        )}.${fileExt}`;

        const { error } = await supabaseClient.storage
          .from(bucket)
          .upload(filePath, file.buffer, { contentType: file.mimetype });

        if (error) {
          throw error;
        }

        const { data } = supabaseClient.storage
          .from(bucket)
          .getPublicUrl(filePath);

        publicUrl = data.publicUrl;
      }

      const result = await PostRepository.update(
        postId,
        publicUrl,
        imageAlt,
        sortedCategoryIds,
        title,
        description,
        content,
        statusId
      );

      if (publicUrl) {
        await supabaseClient.storage
          .from(bucket)
          .remove([post.image.split(`/${bucket}/`)[1]]);
      }

      return result;
    } catch {
      // Rollback
      if (filePath) {
        await supabaseClient.storage.from(bucket).remove([filePath]);
      }

      throw new AppError("Failed to create post", 500);
    }
  },

  likePost: async (postId: number, userId: string) => {
    const lookup = {
      post: await PostRepository.getById(postId),
      like: (await LikeRepository.getByPostIdAndUserId(postId, userId))[0],
    };

    if (!lookup.post) {
      throw new AppError("Post not found", 404);
    }

    if (lookup.like) {
      throw new AppError("This user already liked this post", 400);
    }

    await LikeRepository.like(postId, userId);
  },

  unlikePost: async (postId: number, userId: string) => {
    const lookup = {
      post: await PostRepository.getById(postId),
    };

    if (!lookup.post) {
      throw new AppError("Post not found", 404);
    }

    return LikeRepository.unlike(postId, userId);
  },

  deletePost: async (postId: number) => {
    return PostRepository.delete(postId);
  },
};

export default PostService;
