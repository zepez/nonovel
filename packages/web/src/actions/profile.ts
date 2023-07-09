"use server";

import { revalidatePath } from "next/cache";

import { updateProfileById } from "@nonovel/query";
import { authorizeServerAction } from "~/lib/auth";
import type { EditProfileSchema } from "~/components/settings";

export const updateProfile = async (values: EditProfileSchema) => {
  await authorizeServerAction({ userId: values.userId });

  const [error, result] = await updateProfileById(values);

  revalidatePath("/");

  return [error ? error.serialize() : null, result] as const;
};
