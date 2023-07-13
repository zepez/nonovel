import { db } from "@nonovel/db";
import { placeholder, isNull } from "drizzle-orm";

export const getCommentPageByResourceIdPrepared = db.query.comment
  .findMany({
    orderBy: (comment, { desc }) => [desc(comment.createdAt)],
    where: (comment, { eq, and }) =>
      and(
        eq(comment.resourceId, placeholder("resourceId")),
        isNull(comment.parentId)
      ),
    limit: placeholder("limit"),
    offset: placeholder("offset"),
    with: {
      user: {
        columns: {
          id: true,
        },
        with: {
          profile: {
            columns: {
              username: true,
              image: true,
            },
          },
        },
      },
    },
  })
  .prepare("get_comment_page_by_resource_id_prepared");

export const getCommentRepliesByParentIdPrepared = db.query.comment
  .findMany({
    orderBy: (comment, { asc }) => [asc(comment.createdAt)],
    where: (comment, { eq }) => eq(comment.parentId, placeholder("parentId")),
    with: {
      user: {
        columns: {
          id: true,
        },
        with: {
          profile: {
            columns: {
              username: true,
              image: true,
            },
          },
        },
      },
    },
  })
  .prepare("get_comment_replies_by_parent_id_prepared");
