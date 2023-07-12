import { pgTable, uuid, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { InferModel, relations } from "drizzle-orm";

import { user, project } from "./index";

export const follow = pgTable(
  "follow",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    projectId: uuid("project_id")
      .notNull()
      .references(() => project.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (f) => {
    return {
      uniqueFollowIds: uniqueIndex("unique_follow_ids").on(
        f.userId,
        f.projectId
      ),
    };
  }
);

export const followRelations = relations(follow, ({ one }) => ({
  user: one(user, {
    fields: [follow.userId],
    references: [user.id],
  }),
  project: one(project, {
    fields: [follow.projectId],
    references: [project.id],
  }),
}));

export type Follow = InferModel<typeof follow>;
export type NewFollow = InferModel<typeof follow, "insert">;
