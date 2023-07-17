import { eq, sql } from "drizzle-orm";
import * as z from "zod";
import { db, comment, type Comment } from "@nonovel/db";
import { ServerError, ServerErrorType } from "@nonovel/lib";
import { comment as validator } from "@nonovel/validator";
import {
  getCommentPageByResourceIdPrepared,
  getCommentRepliesByParentIdPrepared,
} from "../prepared";

export interface GetCommentPageByResourceIdOptions {
  resourceId: Comment["resourceId"];
  page: number;
  pageSize: number;
}

export const getCommentPageByResourceId = async (
  opts: GetCommentPageByResourceIdOptions
) => {
  try {
    const parsed = validator
      .extend({
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
      })
      .pick({ resourceId: true, page: true, pageSize: true })
      .parse(opts);

    const result = await getCommentPageByResourceIdPrepared.execute({
      ...parsed,
      limit: parsed.pageSize + 1,
      offset: parsed.pageSize * (parsed.page - 1),
    });

    return [null, result] as const;
  } catch (err) {
    console.log(err);
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetCommentPageByResourceIdReturn = Awaited<
  ReturnType<typeof getCommentPageByResourceId>
>;

// ########################################################

export interface CreateCommentOptions {
  id?: Comment["id"];
  resourceId: Comment["resourceId"];
  parentId?: Comment["parentId"];
  content: Comment["content"];
  userId: NonNullable<Comment["userId"]>;
}

export const createComment = async (opts: CreateCommentOptions) => {
  try {
    const parsed = validator
      .pick({
        userId: true,
        resourceId: true,
        parentId: true,
        content: true,
      })
      .parse(opts);

    await db.transaction(async (tx) => {
      await tx
        .insert(comment)
        .values({ ...parsed, id: opts.id ?? undefined })
        .onConflictDoUpdate({
          target: comment.id,
          set: {
            content: parsed.content,
            updatedAt: sql`now()`,
          },
        });

      if (parsed.parentId && !opts.id) {
        await tx
          .update(comment)
          .set({
            replyCount: sql`${comment.replyCount} + 1`,
          })
          .where(eq(comment.id, parsed.parentId));
      }
    });

    return [null, null] as const;
  } catch (err) {
    console.log(err);
    const error = new ServerError(
      "CreateResourceError",
      err as ServerErrorType
    );
    return [error, null] as const;
  }
};

export type CreateCommentReturn = Awaited<ReturnType<typeof createComment>>;

// ########################################################

export interface GetCommentRepliesByParentIdOptions {
  parentId: Comment["parentId"];
}

export const getCommentRepliesByParentId = async (
  opts: GetCommentRepliesByParentIdOptions
) => {
  try {
    const parsed = validator.pick({ parentId: true }).parse(opts);

    const result = await getCommentRepliesByParentIdPrepared.execute(parsed);

    return [null, result] as const;
  } catch (err) {
    console.log(err);
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetCommentRepliesByParentIdReturn = Awaited<
  ReturnType<typeof getCommentRepliesByParentId>
>;
