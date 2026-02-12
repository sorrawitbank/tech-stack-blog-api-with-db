import { and, count, desc, eq, exists, ilike, or } from "drizzle-orm";
import db from "../db/db";
import { categories, comments, postCategories, posts } from "../db/schema";

const PostRepository = {
  get: async (
    page: number,
    limit: number,
    category: string | null,
    keyword: string | null
  ) => {
    const offset = (page - 1) * limit;
    const filters = [];

    filters.push(eq(posts.statusId, 2));

    if (keyword) {
      filters.push(
        or(
          ilike(posts.title, `%${keyword}%`),
          ilike(posts.description, `%${keyword}%`),
          ilike(posts.content, `%${keyword}%`)
        )
      );
    }

    if (category) {
      filters.push(
        exists(
          db
            .select()
            .from(postCategories)
            .innerJoin(categories, eq(postCategories.categoryId, categories.id))
            .where(
              and(
                eq(postCategories.postId, posts.id),
                ilike(categories.name, `%${category}%`)
              )
            )
        )
      );
    }

    const result = await db.query.posts.findMany({
      with: {
        user: true,
        status: true,
        postCategories: {
          with: {
            category: true,
          },
        },
      },
      where: and(...filters),
      orderBy: [desc(posts.createdAt)],
      limit,
      offset,
    });

    const countResult = await db
      .select({ total: count() })
      .from(posts)
      .where(filters.length ? and(...filters) : undefined);

    const totalPosts = countResult[0]?.total ?? 0;

    return { result, totalPosts };
  },

  getById: async (postId: number) => {
    return await db.query.posts.findFirst({
      with: {
        user: true,
        status: true,
        likes: true,
        comments: {
          with: {
            user: true,
          },
          orderBy: [desc(comments.createdAt)],
        },
        postCategories: {
          with: {
            category: true,
          },
        },
      },
      where: (posts) => eq(posts.id, postId),
    });
  },

  create: async (
    userId: string,
    image: string,
    imageAlt: string | null,
    categoryIds: number[],
    title: string,
    description: string,
    content: string,
    statusId: number
  ) => {
    await db.transaction(async (tx) => {
      const [post] = await tx
        .insert(posts)
        .values({
          userId,
          image,
          imageAlt,
          title,
          description,
          content,
          statusId,
        })
        .returning();

      await tx.insert(postCategories).values(
        categoryIds.map((categoryId) => ({
          postId: post!.id,
          categoryId,
        }))
      );
    });
  },

  update: async (
    postId: number,
    image: string,
    imageAlt: string | null,
    categoryIds: number[],
    title: string,
    description: string,
    content: string,
    statusId: number
  ) => {
    return await db.transaction(async (tx) => {
      const result = await tx
        .update(posts)
        .set({
          image,
          imageAlt,
          title,
          description,
          content,
          statusId,
        })
        .where(eq(posts.id, postId));

      if (!result.rowCount) {
        return result;
      }

      await tx.delete(postCategories).where(eq(postCategories.postId, postId));

      await tx.insert(postCategories).values(
        categoryIds.map((categoryId) => ({
          postId,
          categoryId,
        }))
      );

      return result;
    });
  },

  delete: async (postId: number) => {
    return await db.delete(posts).where(eq(posts.id, postId));
  },
};

export default PostRepository;
