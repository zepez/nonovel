import {
  pgTable,
  uuid,
  timestamp,
  text,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { InferModel, relations } from "drizzle-orm";

import { project, userChapterView, anonChapterView } from "./index";
import { numberNumeric } from "../columns";

export const chapterContentType = pgEnum("chapter_content_type", [
  "html",
  "md",
]);

export const chapter = pgTable(
  "chapter",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => project.id),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    order: numberNumeric("order", { precision: 9, scale: 3 }).notNull(),
    contentType: chapterContentType("content_type").default("html").notNull(),
    content: text("content"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (c) => {
    return {
      chapterProjectIdIndex: index("chapter_project_id_index").on(c.projectId),
      chapterSlugIndex: index("chapter_slug_index").on(c.slug),
      chapterProjectIdAndSlugIndex: uniqueIndex(
        "chapter_project_id_and_slug_index"
      ).on(c.projectId, c.slug),
      chapterOrderIndex: index("chapter_order_index").on(c.order),
    };
  }
);

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
