import * as z from "zod";
import type { Review } from "@nonovel/db";
import { ServerError, ServerErrorType } from "@nonovel/lib";
import {
  upsertReviewPrepared,
  getReviewByIdsPrepared,
  getReviewPageByProjectIdPrepared,
} from "../prepared";
import { review as reviewValidator } from "@nonovel/validator";

export interface UpsertReviewOptions {
  userId: Review["userId"];
  projectId: Review["projectId"];
  score: Review["score"];
  comment: Review["comment"];
}

export const upsertReview = async (opts: UpsertReviewOptions) => {
  try {
    const parsed = reviewValidator
      .pick({ userId: true, projectId: true, score: true, comment: true })
      .parse(opts);

    await upsertReviewPrepared.execute(parsed);

    return [null, null] as const;
  } catch (err) {
    const error = new ServerError(
      "CreateResourceError",
      err as ServerErrorType
    );
    return [error, null] as const;
  }
};

export type UpsertReviewReturn = Awaited<ReturnType<typeof upsertReview>>;

// ########################################################

export interface GetReviewByIdsOptions {
  userId?: Review["userId"];
  projectId: Review["projectId"];
}

export const getReviewByIds = async (opts: GetReviewByIdsOptions) => {
  try {
    if (!opts.userId) return [null, null] as const;

    const parsed = reviewValidator
      .pick({ userId: true, projectId: true })
      .parse(opts);

    const result = (await getReviewByIdsPrepared.execute(parsed)) ?? null;

    return [null, result] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetReviewByIdsReturn = Awaited<ReturnType<typeof getReviewByIds>>;

// ########################################################

export interface GetReviewPageByProjectIdOptions {
  projectId: Review["projectId"];
  page: number;
  pageSize: number;
}

export const getReviewPageByProjectId = async (
  opts: GetReviewPageByProjectIdOptions
) => {
  try {
    const parsed = reviewValidator
      .extend({
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
      })
      .pick({ projectId: true, page: true, pageSize: true })
      .parse(opts);

    const result = await getReviewPageByProjectIdPrepared.execute({
      projectId: parsed.projectId,
      limit: parsed.pageSize,
      offset: parsed.pageSize * (parsed.page - 1),
    });

    return [null, result] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetReviewPageByProjectIdReturn = Awaited<
  ReturnType<typeof getReviewPageByProjectId>
>;
