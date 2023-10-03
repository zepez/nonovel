import { db } from "@nonovel/db";
import { placeholder } from "drizzle-orm";

export const getChapterBySlugsPrepared = db.query.project
  .findFirst({
    where: (project, { eq }) => eq(project.slug, placeholder("project")),
    with: {
      chapters: {
        where: (chapter, { eq }) => eq(chapter.slug, placeholder("chapter")),
      },
    },
  })
  .prepare("get_chapter_by_slugs_prepared");

export const getChapterByOrderPrepared = db.query.project
  .findFirst({
    where: (project, { eq }) => eq(project.slug, placeholder("project")),
    with: {
      chapters: {
        where: (chapter, { eq }) => eq(chapter.order, placeholder("chapter")),
      },
    },
  })
  .prepare("get_chapter_by_order_prepared");

export const getChapterManifestByIdsPrepared = db.query.chapter
  .findMany({
    orderBy: (chapter, { asc }) => [asc(chapter.order)],
    where: (chapter, { eq }) => eq(chapter.projectId, placeholder("projectId")),
    columns: {
      id: true,
      name: true,
      order: true,
      slug: true,
      createdAt: true,
    },
    with: {
      userChapterViews: {
        where: (userChapterView, { eq }) =>
          eq(userChapterView.userId, placeholder("userId")),
        columns: {
          createdAt: true,
        },
      },
    },
  })
  .prepare("get_chapter_manifest_by_project_id_prepared");
