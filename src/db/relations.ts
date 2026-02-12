import { relations } from "drizzle-orm/relations";
import {
  statuses,
  posts,
  users,
  comments,
  likes,
  categories,
  postCategories,
} from "./schema";

export const postsRelations = relations(posts, ({ one, many }) => ({
  status: one(statuses, {
    fields: [posts.statusId],
    references: [statuses.id],
  }),
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(likes),
  postCategories: many(postCategories),
}));

export const statusesRelations = relations(statuses, ({ many }) => ({
  posts: many(posts),
}));

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  likes: many(likes),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}));

export const postCategoriesRelations = relations(postCategories, ({ one }) => ({
  category: one(categories, {
    fields: [postCategories.categoryId],
    references: [categories.id],
  }),
  post: one(posts, {
    fields: [postCategories.postId],
    references: [posts.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  postCategories: many(postCategories),
}));

export const allRelations = {
  postsRelations,
  statusesRelations,
  usersRelations,
  commentsRelations,
  likesRelations,
  postCategoriesRelations,
  categoriesRelations,
};
