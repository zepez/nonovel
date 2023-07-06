import { db, follow } from "@nonovel/db";
import { placeholder, eq, and, sql } from "drizzle-orm";

export const createFollowPrepared = db
  .insert(follow)
  .values({
    userId: placeholder("userId"),
    projectId: placeholder("projectId"),
  })
  .prepare("create_follow_prepared");

export const deleteFollowPrepared = db
  .delete(follow)
  .where(
    and(
      eq(follow.userId, placeholder("userId")),
      eq(follow.projectId, placeholder("projectId"))
    )
  )
  .prepare("delete_follow_prepared");

export const getFollowCountByProjectIdPrepared = db
  .select({ count: sql<number>`count(*)` })
  .from(follow)
  .where(eq(follow.projectId, placeholder("projectId")))
  .prepare("get_follow_count_by_project_id_prepared");

export const getFollowStatusByIdsPrepared = db.query.follow
  .findFirst({
    where: (follow, { eq, and }) =>
      and(
        eq(follow.userId, placeholder("userId")),
        eq(follow.projectId, placeholder("projectId"))
      ),
  })
  .prepare("get_follow_status_by_ids_prepared");
