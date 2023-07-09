"use server";

import { revalidatePath } from "next/cache";

import { createView, type CreateViewOptions } from "@nonovel/query";
import { authorizeServerAction } from "~/lib/auth";

interface MarkViewedOptions extends CreateViewOptions {
  revalidate: string;
}

export const markViewed = async (values: MarkViewedOptions) => {
  await authorizeServerAction({ userId: values.userId, optional: true });

  await createView(values);

  revalidatePath(values.revalidate);

  return [null, null] as const;
};
