import { db, userChapterView } from "@nonovel/db";
import { placeholder, sql, eq } from "drizzle-orm";

export const createUserChapterViewPrepared = db
  .insert(userChapterView)
  .values({
    userId: placeholder("userId"),
    projectId: placeholder("projectId"),
    chapterId: placeholder("chapterId"),
  })
  .onConflictDoNothing()
  .prepare("create_user_chapter_view_prepared");

export const getUserChapterViewCountByProjectIdPrepared = db
  .select({ count: sql<number>`count(project_id)` })
  .from(userChapterView)
  .where(eq(userChapterView.projectId, placeholder("projectId")))
  .prepare("get_user_chapter_view_count_by_project_id_prepared");
