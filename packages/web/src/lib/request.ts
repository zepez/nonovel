import { cache } from "react";

import {
  getUserById as getUserByIdQuery,
  GetUserByIdOptions,
  getProfileById as getProfileByIdQuery,
  GetProfileByIdOptions,
  getProfileByUserId as getProfileByUserIdQuery,
  GetProfileByUserIdOptions,
} from "@nonovel/query";

export const getUserById = cache(
  async (opts: GetUserByIdOptions) => await getUserByIdQuery(opts)
);

export const getProfileById = cache(
  async (opts: GetProfileByIdOptions) => await getProfileByIdQuery(opts)
);

export const getProfileByUserId = cache(
  async (opts: GetProfileByUserIdOptions) => await getProfileByUserIdQuery(opts)
);
