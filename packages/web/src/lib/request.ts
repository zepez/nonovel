import { cache } from "react";

import {
  getUserById as getUserByIdQuery,
  GetUserByIdOptions,
  getProfileById as getProfileByIdQuery,
  GetProfileByIdOptions,
} from "@nonovel/query";

export const getUserById = cache(
  async (opts: GetUserByIdOptions) => await getUserByIdQuery(opts)
);

export const getProfileById = cache(
  async (opts: GetProfileByIdOptions) => await getProfileByIdQuery(opts)
);
