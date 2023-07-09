import { cache } from "react";

import {
  getTotalViewCountByProjectId as getTotalViewCountByProjectIdQuery,
  type GetTotalViewCountByProjectIdOptions,
  getUserChapterViewsByProjectId as getUserChapterViewsByProjectIdQuery,
  type GetUserChapterViewsByProjectIdOptions,
} from "@nonovel/query";

export const getTotalViewCountByProjectId = cache(
  async (opts: GetTotalViewCountByProjectIdOptions) =>
    await getTotalViewCountByProjectIdQuery(opts)
);

export const getUserChapterViewsByProjectId = cache(
  async (opts: GetUserChapterViewsByProjectIdOptions) =>
    await getUserChapterViewsByProjectIdQuery(opts)
);
