import { cache } from "react";

import {
  getChapterBySlugAndOrder as getChapterBySlugAndOrderQuery,
  type GetChapterBySlugAndOrderOptions,
  getChapterManifestByIds as getChapterManifestByIdsQuery,
  type GetChapterManifestByIdsOptions,
} from "@nonovel/query";

export const getChapterBySlugAndOrder = cache(
  async (opts: GetChapterBySlugAndOrderOptions) =>
    await getChapterBySlugAndOrderQuery(opts)
);

export const getChapterManifestByIds = cache(
  async (opts: GetChapterManifestByIdsOptions) =>
    await getChapterManifestByIdsQuery(opts)
);
