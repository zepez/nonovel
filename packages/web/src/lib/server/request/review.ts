import { cache } from "react";

import {
  getReviewByIds as getReviewByIdsQuery,
  type GetReviewByIdsOptions,
  getReviewPageByProjectId as getReviewPageByProjectIdQuery,
  type GetReviewPageByProjectIdOptions,
  getReviewTotalByProjectId as getReviewTotalByProjectIdQuery,
  type GetReviewTotalByProjectIdOptions,
} from "@nonovel/query";

export const getReviewByIds = cache(
  async (opts: GetReviewByIdsOptions) => await getReviewByIdsQuery(opts)
);

export const getReviewPageByProjectId = cache(
  async (opts: GetReviewPageByProjectIdOptions) =>
    await getReviewPageByProjectIdQuery(opts)
);

export const getReviewTotalByProjectId = cache(
  async (opts: GetReviewTotalByProjectIdOptions) =>
    await getReviewTotalByProjectIdQuery(opts)
);
