"use server";

import { revalidatePath } from "next/cache";

import { updateUserById } from "@nonovel/query";
import { authorizeServerAction } from "~/lib/auth";
import type { EditAccountSchema } from "~/components/settings";

interface UpdateAccountOptions extends EditAccountSchema {
  revalidate: string;
}

export const updateAccount = async (values: UpdateAccountOptions) => {
  await authorizeServerAction({ userId: values.id });

  const [error, result] = await updateUserById(values);

  revalidatePath(values.revalidate);

  return [error ? error.serialize() : null, result] as const;
};
