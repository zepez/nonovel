import { cache } from "react";

import {
  getReviewByIds as getReviewByIdsQuery,
  type GetReviewByIdsOptions,
  getReviewPageByProjectId as getReviewPageByProjectIdQuery,
  type GetReviewPageByProjectIdOptions,
} from "@nonovel/query";

export const getReviewByIds = cache(
  async (opts: GetReviewByIdsOptions) => await getReviewByIdsQuery(opts)
);

export const getReviewPageByProjectId = cache(
  async (opts: GetReviewPageByProjectIdOptions) =>
    await getReviewPageByProjectIdQuery(opts)
);
