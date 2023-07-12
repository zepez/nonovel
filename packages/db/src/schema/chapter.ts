import { pgTable, uuid, timestamp, text, pgEnum } from "drizzle-orm/pg-core";
import { InferModel, relations } from "drizzle-orm";

import { project, userChapterView, anonChapterView } from "./index";
import { numberNumeric } from "../columns";

export const chapterContentType = pgEnum("chapter_content_type", [
  "html",
  "md",
]);

export const chapter = pgTable("chapter", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => project.id),
  name: text("name").notNull(),
  order: numberNumeric("order", { precision: 9, scale: 3 }).notNull(),
  contentType: chapterContentType("content_type").default("html").notNull(),
  content: text("content"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const chapterRelations = relations(chapter, ({ one, many }) => ({
  project: one(project, {
    fields: [chapter.projectId],
    references: [project.id],
  }),
  userChapterViews: many(userChapterView),
  anonChapterViews: many(anonChapterView),
}));

export type Chapter = InferModel<typeof chapter>;
export type NewChapter = InferModel<typeof chapter, "insert">;
