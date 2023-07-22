import { db, project, projectGenre, genre, review } from "@nonovel/db";
import { placeholder, sql, eq, and } from "drizzle-orm";

export const getBrowsePageRecentResultPrepared = db
  .select({
    id: project.id,
    name: project.name,
    slug: project.slug,
    description: project.description,
    cover: project.cover,
    genres: sql<
      { name: string; slug: string }[]
    >`json_agg(json_build_object('name', ${genre.name}, 'slug', ${genre.slug}))`,
    review: sql<number>`COALESCE(ROUND(AVG(score)::numeric, 1), 0)`,
    views: sql<number>`(
      COALESCE((SELECT COUNT(*) FROM user_chapter_view WHERE user_chapter_view.project_id = project.id), 0) 
      + 
      COALESCE((SELECT COUNT(*) FROM anon_chapter_view WHERE anon_chapter_view.project_id = project.id), 0)
    )`,
  })
  .from(project)
  .limit(placeholder("limit"))
  .offset(placeholder("offset"))
  .where(
    and(
      sql`(COALESCE(${placeholder(
        "genre"
      )}, '') = '' OR genre.slug = ${placeholder("genre")})`,
      sql`(COALESCE(${placeholder(
        "query"
      )}, '') = '' OR project.name ILIKE '%' || ${placeholder("query")} || '%')`
    )
  )
  .leftJoin(projectGenre, eq(project.id, projectGenre.projectId))
  .leftJoin(genre, eq(projectGenre.genreId, genre.id))
  .leftJoin(review, eq(project.id, review.projectId))
  .orderBy(
    sql`CASE WHEN ${placeholder("sort")} = 'popular' THEN 
    (
      COALESCE((SELECT COUNT(*) FROM user_chapter_view WHERE user_chapter_view.project_id = project.id), 0) 
      + 
      COALESCE((SELECT COUNT(*) FROM anon_chapter_view WHERE anon_chapter_view.project_id = project.id), 0)
    )
    ELSE NULL END DESC`,
    sql`CASE WHEN ${placeholder("sort")} = 'recent' THEN 
    project.created_at
    ELSE NULL END DESC`,
    sql`CASE WHEN ${placeholder("sort")} = 'rating' THEN
    COALESCE(ROUND(AVG(score)::numeric, 1), 0)
    ELSE NULL END DESC`
  )
  .groupBy(project.id)
  .prepare("get_browse_page_result_prepared");
