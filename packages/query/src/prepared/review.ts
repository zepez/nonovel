import { db, review, user, profile, vote } from "@nonovel/db";
import { placeholder, sql, eq, and, or, isNull } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export const upsertReviewPrepared = db
  .insert(review)
  .values({
    userId: placeholder("userId"),
    projectId: placeholder("projectId"),
    score: placeholder("score"),
    comment: placeholder("comment"),
  })
  .onConflictDoUpdate({
    target: [review.projectId, review.userId],
    set: {
      score: placeholder("score") as unknown as number,
      comment: placeholder("comment") as unknown as string,
    },
  })
  .prepare("upsert_review_prepared");

export const getReviewByIdsPrepared = db.query.review
  .findFirst({
    where: (review, { eq, and }) =>
      and(
        eq(review.projectId, placeholder("projectId")),
        eq(review.userId, placeholder("userId"))
      ),
    columns: {
      id: true,
      score: true,
      comment: true,
    },
  })
  .prepare("get_review_by_ids_prepared");

const totalVotes = alias(vote, "total_votes");
const userVotes = alias(vote, "user_votes");

export const getReviewPageByProjectIdPrepared = db
  .select({
    id: review.id,
    score: review.score,
    comment: review.comment,
    user: {
      id: user.id,
    },
    profile: {
      id: profile.id,
      username: profile.username,
      image: profile.image,
    },
    voteTotal: sql<number>`COALESCE(sum(${totalVotes.value}), 0)`,
    voteCurrent: sql<number>`COALESCE(${userVotes.value}, 0)`,
  })
  .from(review)
  .limit(placeholder("limit"))
  .offset(placeholder("offset"))
  .where(eq(review.projectId, placeholder("projectId")))
  .leftJoin(totalVotes, eq(review.id, totalVotes.resourceId))
  .leftJoin(
    userVotes,
    and(
      eq(review.id, userVotes.resourceId),
      or(isNull(userVotes.userId), eq(userVotes.userId, placeholder("userId")))
    )
  )
  .leftJoin(user, eq(review.userId, user.id))
  .leftJoin(profile, eq(user.id, profile.userId))
  .groupBy(review.id, user.id, profile.id, userVotes.value)
  .prepare("get_review_page_by_project_id_prepared");

export const getReviewTotalByProjectIdPrepared = db
  .select({
    count: sql<number>`count(score)`,
    average: sql<number>`COALESCE(ROUND(AVG(score)::numeric, 1), 0)`,
  })
  .from(review)
  .where(eq(review.projectId, placeholder("projectId")))
  .prepare("get_review_total_by_project_id_prepared");

export const deleteReviewByIdPrepared = db
  .delete(review)
  .where(eq(review.id, placeholder("id")))
  .prepare("delete_review_by_id_prepared");
