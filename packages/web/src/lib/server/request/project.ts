import { cache } from "react";

import {
  getProjectBySlug as getProjectBySlugQuery,
  type GetProjectBySlugOptions,
} from "@nonovel/query";

export const getProjectBySlug = cache(
  async (opts: GetProjectBySlugOptions) => await getProjectBySlugQuery(opts)
);
