import { cache } from "react";

import {
  getTotalViewCountByProjectId as getTotalViewCountByProjectIdQuery,
  type GetTotalViewCountByProjectIdOptions,
} from "@nonovel/query";

export const getTotalViewCountByProjectId = cache(
  async (opts: GetTotalViewCountByProjectIdOptions) =>
    await getTotalViewCountByProjectIdQuery(opts)
);
