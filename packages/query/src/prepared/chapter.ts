import { db } from "@nonovel/db";
import { placeholder } from "drizzle-orm";

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

export const getChapterManifestByProjectIdPrepared = db.query.chapter
  .findMany({
    orderBy: (chapter, { asc }) => [asc(chapter.order)],
    where: (chapter, { eq }) => eq(chapter.projectId, placeholder("projectId")),
    columns: {
      id: true,
      name: true,
      order: true,
    },
  })
  .prepare("get_chapter_manifest_by_project_id_prepared");
