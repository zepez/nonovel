import { cache } from "react";

import {
  getChapterBySlugAndOrder as getChapterBySlugAndOrderQuery,
  type GetChapterBySlugAndOrderOptions,
} from "@nonovel/query";

export const getChapterBySlugAndOrder = cache(
  async (opts: GetChapterBySlugAndOrderOptions) =>
    await getChapterBySlugAndOrderQuery(opts)
);
