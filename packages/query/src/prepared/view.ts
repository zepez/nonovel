import { db, view } from "@nonovel/db";
import { placeholder, sql, eq } from "drizzle-orm";

export const createUserViewPrepared = db
  .insert(view)
  .values({
    userId: placeholder("userId"),
    projectId: placeholder("projectId"),
    chapterId: placeholder("chapterId"),
  })
  .onConflictDoNothing()
  .prepare("create_user_view_prepared");

export const getUserViewCountByProjectIdPrepared = db
  .select({ count: sql<number>`count(*)` })
  .from(view)
  .where(eq(view.projectId, placeholder("projectId")))
  .prepare("get_view_count_by_project_id_prepared");
