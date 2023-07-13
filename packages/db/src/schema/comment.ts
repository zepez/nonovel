import {
  pgTable,
  uuid,
  timestamp,
  index,
  text,
  integer,
} from "drizzle-orm/pg-core";
import { InferModel, relations } from "drizzle-orm";

import { user } from "./index";

export const comment = pgTable(
  "comment",
  {
    id: uuid("id").defaultRandom().primaryKey(),
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

export const commentRelations = relations(comment, ({ one }) => ({
  user: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),
}));

export type Comment = InferModel<typeof comment>;
export type NewComment = InferModel<typeof comment, "insert">;
