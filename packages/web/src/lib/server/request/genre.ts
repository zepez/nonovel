import { cache } from "react";

import {
  getGenreManifest as getGenreManifestQuery,
  getGenreBySlug as getGenreBySlugQuery,
  type GetGenreBySlugOptions,
} from "@nonovel/query";

export const getGenreManifest = cache(
  async () => await getGenreManifestQuery()
);

export const getGenreBySlug = cache(
  async (opts: GetGenreBySlugOptions) => await getGenreBySlugQuery(opts)
);
