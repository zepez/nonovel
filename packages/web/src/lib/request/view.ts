import { cache } from "react";

import {
  getUserViewCountByProjectId as getUserViewCountByProjectIdQuery,
  type GetUserViewCountByProjectIdOptions,
} from "@nonovel/query";

export const getUserViewCountByProjectId = cache(
  async (opts: GetUserViewCountByProjectIdOptions) =>
    await getUserViewCountByProjectIdQuery(opts)
);
