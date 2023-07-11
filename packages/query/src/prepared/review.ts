import { db, review } from "@nonovel/db";
import { placeholder, sql, eq } from "drizzle-orm";

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

export const getReviewPageByProjectIdPrepared = db.query.review
  .findMany({
    where: (review, { eq }) => eq(review.projectId, placeholder("projectId")),
    limit: placeholder("limit"),
    offset: placeholder("offset"),
    columns: {
      id: true,
      score: true,
      comment: true,
    },
    with: {
      user: {
        columns: {
          id: true,
        },
        with: {
          profile: {
            columns: {
              id: true,
              username: true,
              image: true,
            },
          },
        },
      },
    },
  })
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
