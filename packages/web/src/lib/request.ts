import { cache } from "react";

import {
  getUserById as getUserByIdQuery,
  type GetUserByIdOptions,
  getProfileByUsername as getProfileByUsernameQuery,
  type GetProfileByUsernameOptions,
  getProfileByUserId as getProfileByUserIdQuery,
  type GetProfileByUserIdOptions,
  getProjectBySlug as getProjectBySlugQuery,
  type GetProjectBySlugOptions,
  getFollowCountByProjectId as getFollowCountByProjectIdQuery,
  type GetFollowCountByProjectIdOptions,
  getFollowStatusByIds as getFollowStatusByIdsQuery,
  type GetFollowStatusByIdsOptions,
  getChapterBySlugAndOrder as getChapterBySlugAndOrderQuery,
  type GetChapterBySlugAndOrderOptions,
} from "@nonovel/query";

export const getUserById = cache(
  async (opts: GetUserByIdOptions) => await getUserByIdQuery(opts)
);

export const getProfileByUsername = cache(
  async (opts: GetProfileByUsernameOptions) =>
    await getProfileByUsernameQuery(opts)
);

export const getProfileByUserId = cache(
  async (opts: GetProfileByUserIdOptions) => await getProfileByUserIdQuery(opts)
);

export const getProjectBySlug = cache(
  async (opts: GetProjectBySlugOptions) => await getProjectBySlugQuery(opts)
);

export const getFollowCountByProjectId = cache(
  async (opts: GetFollowCountByProjectIdOptions) =>
    await getFollowCountByProjectIdQuery(opts)
);

export const getFollowStatusByIds = cache(
  async (opts: GetFollowStatusByIdsOptions) =>
    await getFollowStatusByIdsQuery(opts)
);

export const getChapterBySlugAndOrder = cache(
  async (opts: GetChapterBySlugAndOrderOptions) =>
    await getChapterBySlugAndOrderQuery(opts)
);
