import { cache } from "react";

import {
  getChapterBySlugAndOrder as getChapterBySlugAndOrderQuery,
  type GetChapterBySlugAndOrderOptions,
  getChapterManifestByProjectId as getChapterManifestByProjectIdQuery,
  type GetChapterManifestByProjectIdOptions,
} from "@nonovel/query";

export const getChapterBySlugAndOrder = cache(
  async (opts: GetChapterBySlugAndOrderOptions) =>
    await getChapterBySlugAndOrderQuery(opts)
);

export const getChapterManifestByProjectId = cache(
  async (opts: GetChapterManifestByProjectIdOptions) =>
    await getChapterManifestByProjectIdQuery(opts)
);
