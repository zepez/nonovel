"use server";

import { revalidatePath } from "next/cache";

import { updateUserById } from "@nonovel/query";
import { authorizeServerAction } from "~/lib/auth";
import type { EditAccountSchema } from "~/components/settings";

export const updateAccount = async (values: EditAccountSchema) => {
  await authorizeServerAction({ userId: values.id });

  const [error, result] = await updateUserById(values);

  revalidatePath("/");

  return [error ? error.serialize() : null, result] as const;
};
