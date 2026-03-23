import { format } from "date-fns";
import { UTCDate } from "@date-fns/utc";
import AppError from "../errors/AppError";
import CategoryRepository from "../repositories/category.repository";
import PostRepository from "../repositories/post.repository";
import StatusRepository from "../repositories/status.repository";
import supabaseAdmin from "../supabase/admin";
import supabaseClient from "../supabase/client";

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

  getPostById: async (postId: number) => {
    const result = await PostRepository.getById(postId);

    if (!result) return;

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

  createPost: async (
    userId: string,
    imageAlt: string | null,
    categories: string[],
    title: string,
    description: string,
    content: string,
    status: string,
    file: Express.Multer.File
  ) => {
    const lookup = {
      statuses: await StatusRepository.get(),
      categories: await CategoryRepository.get(),
    };

    if (!lookup.statuses.map((status) => status.name).includes(status)) {
      throw new AppError("Status not found", 404);
    }

    const categoryNames = lookup.categories.map((category) => category.name);
    for (const category of categories) {
      if (!categoryNames.includes(category)) {
        throw new AppError("Some categories not found", 404);
      }
    }

    const resolvedIds: {
      status: number;
      categories: number[];
    } = {
      status: 0,
      categories: [],
    };

    resolvedIds.status = lookup.statuses.find(
      (statusLookup) => statusLookup.name === status
    )!.id;
    resolvedIds.categories = categories
      .map(
        (category) =>
          lookup.categories.find(
            (categoryLookup) => categoryLookup.name === category
          )!.id
      )
      .sort((a, b) => a - b);

    let filePath: string | undefined;

    try {
      // Upload pet image
      const now = new UTCDate();
      const fileExt = file.mimetype.split("/")[1];
      filePath = `${title.replace(" ", "_")}-${format(
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
        resolvedIds.categories,
        title,
        description,
        content,
        resolvedIds.status
      );
    } catch {
      // Rollback
      if (filePath) {
        await supabaseAdmin.storage.from(bucket).remove([filePath]);
      }

      throw new AppError("Failed to create post", 500);
    }
  },

  updatePost: async (
    userId: string,
    postId: number,
    imageAlt: string | null,
    categories: string[],
    title: string,
    description: string,
    content: string,
    status: string,
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

    const post = lookup.posts.filter((post) => post.id === postId)[0];

    if (!lookup.statuses.map((status) => status.name).includes(status)) {
      throw new AppError("Status not found", 404);
    }

    const categoryNames = lookup.categories.map((category) => category.name);
    for (const category of categories) {
      if (!categoryNames.includes(category)) {
        throw new AppError("Some categories not found", 404);
      }
    }

    const resolvedIds: {
      status: number;
      categories: number[];
    } = {
      status: 0,
      categories: [],
    };

    resolvedIds.status = lookup.statuses.find(
      (statusLookup) => statusLookup.name === status
    )!.id;
    resolvedIds.categories = categories
      .map(
        (category) =>
          lookup.categories.find(
            (categoryLookup) => categoryLookup.name === category
          )!.id
      )
      .sort((a, b) => a - b);

    let filePath: string | undefined;

    try {
      let publicUrl: string | undefined;

      // Upload pet image
      if (file) {
        const now = new UTCDate();
        const fileExt = file.mimetype.split("/")[1];
        filePath = `${title.replace(" ", "_")}-${format(
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
        resolvedIds.categories,
        title,
        description,
        content,
        resolvedIds.status
      );

      if (publicUrl) {
        await supabaseAdmin.storage
          .from(bucket)
          .remove([post.image.split(`/${bucket}/`)[1]]);
      }

      return result;
    } catch {
      // Rollback
      if (filePath) {
        await supabaseAdmin.storage.from(bucket).remove([filePath]);
      }

      throw new AppError("Failed to create post", 500);
    }
  },

  deletePost: async (postId: number) => {
    return PostRepository.delete(postId);
  },
};

export default PostService;
