import { db, project } from "@nonovel/db";
import { sql, placeholder, desc } from "drizzle-orm";

export const getFeaturedPopularPrepared = db
  .select({
    id: project.id,
    name: project.name,
    penName: project.penName,
    slug: project.slug,
    description: project.description,
    cover: project.cover,
  })
  .from(project)
  .limit(placeholder("limit"))
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
    ) 
    WHEN ${placeholder("period")} = 'all' THEN 
    (
      COALESCE((SELECT COUNT(*) FROM user_chapter_view WHERE user_chapter_view.project_id = project.id), 0) 
      + 
      COALESCE((SELECT COUNT(*) FROM anon_chapter_view WHERE anon_chapter_view.project_id = project.id), 0)
    ) ELSE NULL END DESC`
  )
  .groupBy(project.id)
  .prepare("get_featured_popular_prepared");

export const getFeaturedRecentPrepared = db
  .select({
    id: project.id,
    name: project.name,
    penName: project.penName,
    slug: project.slug,
    description: project.description,
    cover: project.cover,
  })
  .from(project)
  .limit(placeholder("limit"))
  .orderBy(desc(project.createdAt))
  .groupBy(project.id)
  .prepare("get_featured_recent_prepared");
