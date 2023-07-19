import { db, comment, user, profile, vote } from "@nonovel/db";
import {
  placeholder,
  desc,
  asc,
  eq,
  and,
  isNull,
  sql,
  isNotNull,
} from "drizzle-orm";

export const getCommentPageByResourceIdPrepared = db
  .select({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    userId: comment.userId,
    parentId: comment.parentId,
    resourceId: comment.resourceId,
    resourceType: comment.resourceType,
    replyCount: comment.replyCount,
    user: {
      id: user.id,
    },
    profile: {
      username: profile.username,
      image: profile.image,
    },
    voteTotal: sql<number>`COALESCE(sum(${vote.value}), 0)`,
  })
  .from(comment)
  .limit(placeholder("limit"))
  .offset(placeholder("offset"))
  .where(
    and(
      eq(comment.resourceId, placeholder("resourceId")),
      isNull(comment.parentId)
    )
  )
  .leftJoin(vote, eq(comment.id, vote.resourceId))
  .leftJoin(user, eq(comment.userId, user.id))
  .leftJoin(profile, eq(user.id, profile.userId))
  .orderBy(
    desc(
      sql`CASE WHEN ${comment.userId} = ${placeholder(
        "userId"
      )} THEN 1 ELSE 0 END`
    ),
    desc(
      sql`CASE WHEN ${comment.userId} = ${placeholder("userId")} THEN ${
        comment.createdAt
      } END`
    ),
    desc(isNotNull(comment.userId)),
    desc(sql<number>`COALESCE(sum(${vote.value}), 0)`)
  )
  .groupBy(comment.id, user.id, profile.id)
  .prepare("get_comment_page_by_resource_id_prepared");

export const getCommentRepliesByParentIdPrepared = db
  .select({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    userId: comment.userId,
    parentId: comment.parentId,
    resourceId: comment.resourceId,
    resourceType: comment.resourceType,
    replyCount: comment.replyCount,
    user: {
      id: user.id,
    },
    profile: {
      username: profile.username,
      image: profile.image,
    },
    voteTotal: sql<number>`COALESCE(sum(${vote.value}), 0)`,
  })
  .from(comment)
  .where(eq(comment.parentId, placeholder("parentId")))
  .leftJoin(vote, eq(comment.id, vote.resourceId))
  .leftJoin(user, eq(comment.userId, user.id))
  .leftJoin(profile, eq(user.id, profile.userId))
  .orderBy(asc(comment.createdAt))
  .groupBy(comment.id, user.id, profile.id)
  .prepare("get_comment_replies_by_parent_id_prepared");
