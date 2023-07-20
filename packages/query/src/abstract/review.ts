import * as z from "zod";
import type { Review } from "@nonovel/db";
import { ServerError, ServerErrorType } from "@nonovel/lib";
import {
  upsertReviewPrepared,
  getReviewByIdsPrepared,
  getReviewPageByProjectIdPrepared,
  getReviewTotalByProjectIdPrepared,
  deleteReviewByIdPrepared,
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
  userId: Review["userId"] | null;
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
      .pick({ projectId: true, userId: true, page: true, pageSize: true })
      .parse(opts);

    const result = await getReviewPageByProjectIdPrepared.execute({
      ...parsed,
      limit: parsed.pageSize + 1,
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

// ########################################################

export interface GetReviewTotalByProjectIdOptions {
  projectId: Review["projectId"];
}

export const getReviewTotalByProjectId = async (
  opts: GetReviewTotalByProjectIdOptions
) => {
  const defaultValue = { count: 0, average: 0 };
  try {
    const parsed = reviewValidator.pick({ projectId: true }).parse(opts);

    const query = await getReviewTotalByProjectIdPrepared.execute(parsed);
    const result = query?.[0] ?? defaultValue;

    return [null, result] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, defaultValue] as const;
  }
};

export type GetReviewTotalByProjectIdReturn = Awaited<
  ReturnType<typeof getReviewTotalByProjectId>
>;

// ########################################################

export interface DeleteReviewByIdOptions {
  id: Review["id"];
}

export const deleteReviewById = async (opts: DeleteReviewByIdOptions) => {
  try {
    const parsed = reviewValidator.pick({ id: true }).parse(opts);

    await deleteReviewByIdPrepared.execute(parsed);

    return [null, null] as const;
  } catch (err) {
    const error = new ServerError(
      "DeleteResourceError",
      err as ServerErrorType
    );
    return [error, null] as const;
  }
};

export type DeleteReviewByIdReturn = Awaited<
  ReturnType<typeof deleteReviewById>
>;
