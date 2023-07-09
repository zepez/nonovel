import { db, userChapterView, anonChapterView } from "@nonovel/db";
import { placeholder, sql } from "drizzle-orm";

export const createUserChapterViewPrepared = db
  .insert(userChapterView)
  .values({
    userId: placeholder("userId"),
    projectId: placeholder("projectId"),
    chapterId: placeholder("chapterId"),
  })
  .onConflictDoNothing()
  .prepare("create_user_chapter_view_prepared");

export const createAnonChapterViewPrepared = db
  .insert(anonChapterView)
  .values({
    projectId: placeholder("projectId"),
    chapterId: placeholder("chapterId"),
  })
  .onConflictDoNothing()
  .prepare("create_anon_chapter_view_prepared");

export const getTotalChapterViewCountByProjectIdPrepared = db
  .select({
    count: sql<number>`SUM(count)`,
  })
  .from(
    sql`(
    SELECT COUNT(*) AS count
    FROM user_chapter_view
    WHERE user_chapter_view.project_id = ${placeholder("projectId")}
    
    UNION ALL
    
    SELECT COUNT(*) AS count
    FROM anon_chapter_view
    WHERE anon_chapter_view.project_id = ${placeholder("projectId")}
    ) AS total_views`
  )
  .prepare("get_total_chapter_view_count_by_project_id_prepared");

export const getUserChapterViewsByProjectIdPrepared = db.query.userChapterView
  .findMany({
    orderBy: (userChapterView, { desc }) => [desc(userChapterView.createdAt)],
    where: (userChapterView, { eq, and }) =>
      and(
        eq(userChapterView.projectId, placeholder("projectId")),
        eq(userChapterView.userId, placeholder("userId"))
      ),
    columns: {
      chapterId: true,
    },
    with: {
      chapter: {
        columns: {
          order: true,
          name: true,
        },
      },
    },
  })
  .prepare("get_user_chapter_views_by_project_id_prepared");
