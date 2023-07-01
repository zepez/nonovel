import { cache } from "react";

import {
  getUserById as getUserByIdQuery,
  GetUserByIdOptions,
  getProfileByUsername as getProfileByUsernameQuery,
  GetProfileByUsernameOptions,
  getProfileByUserId as getProfileByUserIdQuery,
  GetProfileByUserIdOptions,
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
