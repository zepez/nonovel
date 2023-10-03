import { cache } from "react";

import {
  getChapterBySlugs as getChapterBySlugsQuery,
  type GetChapterBySlugsOptions,
  getChapterManifestByIds as getChapterManifestByIdsQuery,
  type GetChapterManifestByIdsOptions,
} from "@nonovel/query";

export const getChapterBySlugs = cache(
  async (opts: GetChapterBySlugsOptions) => await getChapterBySlugsQuery(opts)
);

export const getChapterManifestByIds = cache(
  async (opts: GetChapterManifestByIdsOptions) =>
    await getChapterManifestByIdsQuery(opts)
);
