import { cache } from "react";

import {
  getBrowsePageResult as getBrowsePageResultQuery,
  type GetBrowsePageResultOptions,
} from "@nonovel/query";

export const getBrowsePageResult = cache(
  async (opts: GetBrowsePageResultOptions) =>
    await getBrowsePageResultQuery(opts)
);
