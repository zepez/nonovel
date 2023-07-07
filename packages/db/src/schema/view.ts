import { pgTable, uuid, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { InferModel, relations, sql } from "drizzle-orm";

import { user, project, chapter } from "./index";

export const view = pgTable(
  "view",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    projectId: uuid("project_id")
      .notNull()
      .references(() => project.id),
    chapterId: uuid("chapter_id")
      .notNull()
      .references(() => chapter.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (v) => {
    return {
      uniqueUserView: uniqueIndex("unique_user_view")
        .on(v.userId, v.projectId, v.chapterId)
        .where(sql`${v.userId} IS NOT NULL`),
    };
  }
);

export const viewRelations = relations(view, ({ one }) => ({
  user: one(user, {
    fields: [view.userId],
    references: [user.id],
  }),
  project: one(project, {
    fields: [view.projectId],
    references: [project.id],
  }),
  chapter: one(chapter, {
    fields: [view.chapterId],
    references: [chapter.id],
  }),
}));

export type View = InferModel<typeof view>;
export type NewView = InferModel<typeof view, "insert">;
