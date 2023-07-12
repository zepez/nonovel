"use server";

import {
  getOmniSearchResult as getOmniSearchResultQuery,
  type GetOmniSearchResultOptions,
} from "@nonovel/query";

export const getSearch = async (values: GetOmniSearchResultOptions) => {
  const [error, result] = await getOmniSearchResultQuery(values);

  return [error ? error.serialize() : null, result] as const;
};
