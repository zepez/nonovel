import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { InferModel, relations } from "drizzle-orm";

import { project, chapter } from "./index";

export const anonChapterView = pgTable("anon_chapter_view", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => project.id),
  chapterId: uuid("chapter_id")
    .notNull()
    .references(() => chapter.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const anonChapterViewRelations = relations(
  anonChapterView,
  ({ one }) => ({
    project: one(project, {
      fields: [anonChapterView.projectId],
      references: [project.id],
    }),
    chapter: one(chapter, {
      fields: [anonChapterView.chapterId],
      references: [chapter.id],
    }),
  })
);

export type AnonChapterView = InferModel<typeof anonChapterView>;
export type NewAnonChapterView = InferModel<typeof anonChapterView, "insert">;
