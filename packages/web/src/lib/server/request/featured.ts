import { cache } from "react";

import {
  getFeaturedPopular as getFeaturedPopularQuery,
  GetFeaturedPopularOpts,
} from "@nonovel/query";

export const getFeaturedPopular = cache(
  async (opts: GetFeaturedPopularOpts) => await getFeaturedPopularQuery(opts)
);
