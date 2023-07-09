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
