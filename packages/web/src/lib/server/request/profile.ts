import { cache } from "react";

import {
  getProfileByUsername as getProfileByUsernameQuery,
  type GetProfileByUsernameOptions,
  getProfileByUserId as getProfileByUserIdQuery,
  type GetProfileByUserIdOptions,
} from "@nonovel/query";

export const getProfileByUsername = cache(
  async (opts: GetProfileByUsernameOptions) =>
    await getProfileByUsernameQuery(opts)
);

export const getProfileByUserId = cache(
  async (opts: GetProfileByUserIdOptions) => await getProfileByUserIdQuery(opts)
);
