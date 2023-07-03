import { cache } from "react";

import {
  getUserById as getUserByIdQuery,
  type GetUserByIdOptions,
  getProfileByUsername as getProfileByUsernameQuery,
  type GetProfileByUsernameOptions,
  getProfileByUserId as getProfileByUserIdQuery,
  type GetProfileByUserIdOptions,
  getProjectById as getProjectByIdQuery,
  type GetProjectByIdOptions,
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

export const getProjectById = cache(
  async (opts: GetProjectByIdOptions) => await getProjectByIdQuery(opts)
);

export const getChapterBySlugAndOrder = cache(
  async (opts: GetChapterBySlugAndOrderOptions) =>
    await getChapterBySlugAndOrderQuery(opts)
);
