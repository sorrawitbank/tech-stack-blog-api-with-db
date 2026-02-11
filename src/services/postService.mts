import AppError from "../errors/AppError.ts";
import CategoryRepository from "../repositories/categoryRepository.mts";
import PostRepository from "../repositories/postRepository.mts";
import StatusRepository from "../repositories/statusRepository.mts";
import UserRepository from "../repositories/userRepository.mts";

const PostService = {
  getPosts: async (
    page: number,
    limit: number,
    category: string | null,
    keyword: string | null
  ) => {
    const { result, totalPosts } = await PostRepository.get(
      page,
      limit,
      category,
      keyword
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
    image: string,
    imageAlt: string | null,
    categories: string[],
    title: string,
    description: string,
    content: string,
    status: string
  ) => {
    const lookup = {
      user: (await UserRepository.getById(userId))[0],
      statuses: await StatusRepository.get(),
      categories: await CategoryRepository.get(),
    };

    if (!lookup.user) {
      throw new AppError("User not found", 404);
    }

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
      user: string;
      status: number;
      categories: number[];
    } = {
      user: "",
      status: 0,
      categories: [],
    };

    resolvedIds.user = lookup.user.id;
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

    await PostRepository.create(
      resolvedIds.user,
      image,
      imageAlt,
      resolvedIds.categories,
      title,
      description,
      content,
      resolvedIds.status
    );
  },

  updatePost: async (
    postId: number,
    image: string,
    imageAlt: string | null,
    categories: string[],
    title: string,
    description: string,
    content: string,
    status: string
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

    return await PostRepository.update(
      postId,
      image,
      imageAlt,
      resolvedIds.categories,
      title,
      description,
      content,
      resolvedIds.status
    );
  },

  deletePost: async (postId: number) => {
    return await PostRepository.delete(postId);
  },
};

export default PostService;
