"use server";

import { createView, type CreateViewOptions } from "@nonovel/query";

export const markViewed = async (values: CreateViewOptions) => {
  await createView(values);

  return [null, null] as const;
};
