import { cache } from "react";

import {
  getUserById as getUserByIdQuery,
  type GetUserByIdOptions,
} from "@nonovel/query";

export const getUserById = cache(
  async (opts: GetUserByIdOptions) => await getUserByIdQuery(opts)
);
