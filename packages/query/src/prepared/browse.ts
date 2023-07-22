import { db, project, projectGenre, genre, review } from "@nonovel/db";
import { placeholder, sql, eq, asc, and } from "drizzle-orm";

export const getBrowsePageResultPrepared = db
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
  .orderBy(asc(project.createdAt))
  .groupBy(project.id)
  .prepare("get_browse_page_result_prepared");
