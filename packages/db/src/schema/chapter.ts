import {
  pgTable,
  uuid,
  timestamp,
  text,
  pgEnum,
  numeric,
  integer,
} from "drizzle-orm/pg-core";
import { InferModel, relations } from "drizzle-orm";

import { project } from "./index";

export const chapterContentType = pgEnum("chapter_content_type", [
  "html",
  "md",
]);

export const chapter = pgTable("chapter", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => project.id)
    .notNull(),
  name: text("name").notNull(),
  order: numeric("order", { precision: 9, scale: 3 }).notNull(),
  contentType: chapterContentType("content_type").default("html").notNull(),
  content: text("content"),
  anonViews: integer("anon_views").default(0).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const chapterRelations = relations(chapter, ({ one }) => ({
  project: one(project, {
    fields: [chapter.projectId],
    references: [project.id],
  }),
}));

export type Chapter = InferModel<typeof chapter>;
export type NewChapter = InferModel<typeof chapter, "insert">;
