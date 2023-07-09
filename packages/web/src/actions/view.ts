"use server";

import { createView, type CreateViewOptions } from "@nonovel/query";
import { authorizeServerAction } from "~/lib/auth";

export const markViewed = async (values: CreateViewOptions) => {
  await authorizeServerAction({ userId: values.userId, optional: true });

  await createView(values);

  return [null, null] as const;
};
