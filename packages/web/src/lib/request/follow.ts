import { cache } from "react";

import {
  getFollowCountByProjectId as getFollowCountByProjectIdQuery,
  type GetFollowCountByProjectIdOptions,
  getFollowStatusByIds as getFollowStatusByIdsQuery,
  type GetFollowStatusByIdsOptions,
} from "@nonovel/query";

export const getFollowCountByProjectId = cache(
  async (opts: GetFollowCountByProjectIdOptions) =>
    await getFollowCountByProjectIdQuery(opts)
);

export const getFollowStatusByIds = cache(
  async (opts: GetFollowStatusByIdsOptions) =>
    await getFollowStatusByIdsQuery(opts)
);
