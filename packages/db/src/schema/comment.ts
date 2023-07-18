import {
  pgTable,
  uuid,
  timestamp,
  index,
  text,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { InferModel, relations } from "drizzle-orm";

import { user, vote } from "./index";

export const commentResourceType = pgEnum("comment_resource_type", [
  "profile",
  "project",
  "chapter",
]);

export const comment = pgTable(
  "comment",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    resourceType: commentResourceType("resource_type").notNull(),
    resourceId: uuid("resource_id").notNull(),
    userId: uuid("user_id"),
    parentId: uuid("parent_id"),
    replyCount: integer("reply_count").default(0).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (f) => {
    return {
      commentUserIdIndex: index("comment_user_id_index").on(f.userId),
      commentResourceIdIndex: index("comment_resource_id_index").on(
        f.resourceId
      ),
      commentParentIdIndex: index("comment_parent_id_index").on(f.parentId),
    };
  }
);

export const commentRelations = relations(comment, ({ one, many }) => ({
  user: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),
  votes: many(vote),
}));

export type Comment = InferModel<typeof comment>;
export type NewComment = InferModel<typeof comment, "insert">;
