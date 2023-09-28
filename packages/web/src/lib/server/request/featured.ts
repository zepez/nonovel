import { cache } from "react";

import {
  getFeaturedPopular as getFeaturedPopularQuery,
  GetFeaturedPopularOpts,
  getFeaturedRecent as getFeaturedRecentQuery,
  GetFeaturedRecentOpts,
} from "@nonovel/query";

export const getFeaturedPopular = cache(
  async (opts: GetFeaturedPopularOpts) => await getFeaturedPopularQuery(opts)
);

export const getFeaturedRecent = cache(
  async (opts: GetFeaturedRecentOpts) => await getFeaturedRecentQuery(opts)
);
