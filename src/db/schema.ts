import {
  pgTable,
  unique,
  check,
  uuid,
  text,
  serial,
  foreignKey,
  integer,
  timestamp,
  index,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const role = pgEnum("role", ["user", "admin"]);

export const users = pgTable(
  "users",
  {
    id: uuid().primaryKey().notNull(),
    username: text().notNull(),
    name: text().notNull(),
    profilePic: text("profile_pic"),
    role: role().default("user").notNull(),
  },
  (table) => [
    unique("users_username_key").on(table.username),
    check(
      "users_role_check",
      sql`(role)::text = ANY (ARRAY[('user'::character varying)::text, ('admin'::character varying)::text])`
    ),
  ]
);

export const categories = pgTable(
  "categories",
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
  },
  (table) => [unique("categories_name_key").on(table.name)]
);

export const statuses = pgTable(
  "statuses",
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
  },
  (table) => [unique("statuses_status_key").on(table.name)]
);

export const posts = pgTable(
  "posts",
  {
    id: serial().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    image: text().notNull(),
    imageAlt: text("image_alt"),
    title: text().notNull(),
    description: text().notNull(),
    content: text().notNull(),
    statusId: integer("status_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.statusId],
      foreignColumns: [statuses.id],
      name: "posts_status_id_fkey",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "posts_user_id_fkey",
    }).onDelete("cascade"),
  ]
);

export const comments = pgTable(
  "comments",
  {
    id: serial().primaryKey().notNull(),
    postId: integer("post_id").notNull(),
    userId: uuid("user_id").notNull(),
    commentText: text("comment_text").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
      name: "comments_post_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "comments_user_id_fkey",
    }).onDelete("cascade"),
  ]
);

export const likes = pgTable(
  "likes",
  {
    id: serial().primaryKey().notNull(),
    postId: integer("post_id").notNull(),
    userId: uuid("user_id").notNull(),
    likedAt: timestamp("liked_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
      name: "likes_post_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "likes_user_id_fkey",
    }).onDelete("cascade"),
    unique("likes_post_id_user_id_key").on(table.postId, table.userId),
  ]
);

export const postCategories = pgTable(
  "post_categories",
  {
    postId: integer("post_id").notNull(),
    categoryId: integer("category_id").notNull(),
  },
  (table) => [
    index("post_categories_category_id_idx").using(
      "btree",
      table.categoryId.asc().nullsLast().op("int4_ops")
    ),
    index("post_categories_post_id_idx").using(
      "btree",
      table.postId.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [categories.id],
      name: "post_categories_category_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
      name: "post_categories_post_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.postId, table.categoryId],
      name: "post_categories_pkey",
    }),
  ]
);

export const allTables = {
  users,
  categories,
  statuses,
  posts,
  comments,
  likes,
  postCategories,
};
