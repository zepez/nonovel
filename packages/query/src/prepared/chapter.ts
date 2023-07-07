import { db, chapter } from "@nonovel/db";
import { placeholder, sql, eq } from "drizzle-orm";

export const getChapterBySlugAndOrderPrepared = db.query.project
  .findFirst({
    where: (project, { eq }) => eq(project.slug, placeholder("slug")),
    with: {
      chapters: {
        where: (chapter, { eq }) => eq(chapter.order, placeholder("order")),
      },
    },
  })
  .prepare("get_chapter_by_slug_and_order_prepared");

export const incrementChapterAnonViewsPrepared = db
  .update(chapter)
  .set({ anonViews: sql`${chapter.anonViews} + 1` })
  .where(eq(chapter.id, placeholder("chapterId")))
  .prepare("increment_chapter_anon_views_prepared");

export const getProjectAnonViewCountPrepared = db
  .select({ count: sql<number>`sum(anon_views)` })
  .from(chapter)
  .where(eq(chapter.projectId, placeholder("projectId")))
  .prepare("get_chapter_anon_view_count_prepared");
