import { cache } from "react";

import {
  getReviewByIds as getReviewByIdsQuery,
  type GetReviewByIdsOptions,
} from "@nonovel/query";

export const getReviewByIds = cache(
  async (opts: GetReviewByIdsOptions) => await getReviewByIdsQuery(opts)
);
