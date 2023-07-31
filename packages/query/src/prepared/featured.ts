import { db, project, projectGenre, genre, review } from "@nonovel/db";
import { sql, eq, placeholder } from "drizzle-orm";

export const getFeaturedPopularPrepared = db
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
  .limit(5)
  .leftJoin(projectGenre, eq(project.id, projectGenre.projectId))
  .leftJoin(genre, eq(projectGenre.genreId, genre.id))
  .leftJoin(review, eq(project.id, review.projectId))
  .orderBy(
    sql`CASE WHEN ${placeholder("period")} = 'day' THEN 
    (
      COALESCE((SELECT COUNT(*) FROM user_chapter_view WHERE user_chapter_view.project_id = project.id AND user_chapter_view.created_at >= NOW() - INTERVAL '1 day'), 0) 
      + 
      COALESCE((SELECT COUNT(*) FROM anon_chapter_view WHERE anon_chapter_view.project_id = project.id AND anon_chapter_view.created_at >= NOW() - INTERVAL '1 day'), 0)
    )
    WHEN ${placeholder("period")} = 'week' THEN 
    (
      COALESCE((SELECT COUNT(*) FROM user_chapter_view WHERE user_chapter_view.project_id = project.id AND user_chapter_view.created_at >= NOW() - INTERVAL '1 week'), 0) 
      + 
      COALESCE((SELECT COUNT(*) FROM anon_chapter_view WHERE anon_chapter_view.project_id = project.id AND anon_chapter_view.created_at >= NOW() - INTERVAL '1 week'), 0)
    )
    WHEN ${placeholder("period")} = 'month' THEN 
    (
      COALESCE((SELECT COUNT(*) FROM user_chapter_view WHERE user_chapter_view.project_id = project.id AND user_chapter_view.created_at >= NOW() - INTERVAL '1 month'), 0) 
      + 
      COALESCE((SELECT COUNT(*) FROM anon_chapter_view WHERE anon_chapter_view.project_id = project.id AND anon_chapter_view.created_at >= NOW() - INTERVAL '1 month'), 0)
    ) ELSE NULL END DESC`
  )
  .groupBy(project.id)
  .prepare("get_featured_popular_prepared");
