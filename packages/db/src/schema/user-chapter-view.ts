import { pgTable, uuid, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { InferModel, relations } from "drizzle-orm";

import { user, project, chapter } from "./index";

export const userChapterView = pgTable(
  "user_chapter_view",
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
      uniqueUserChapterView: uniqueIndex("unique_user_view").on(
        v.userId,
        v.projectId,
        v.chapterId
      ),
    };
  }
);

export const userChapterViewRelations = relations(
  userChapterView,
  ({ one }) => ({
    user: one(user, {
      fields: [userChapterView.userId],
      references: [user.id],
    }),
    project: one(project, {
      fields: [userChapterView.projectId],
      references: [project.id],
    }),
    chapter: one(chapter, {
      fields: [userChapterView.chapterId],
      references: [chapter.id],
    }),
  })
);

export type UserChapterView = InferModel<typeof userChapterView>;
export type NewUserChapterView = InferModel<typeof userChapterView, "insert">;
