"use server";

import { revalidatePath } from "next/cache";

import { updateProfileById } from "@nonovel/query";
import type { EditProfileSchema } from "~/components/settings";

export const updateProfile = async (values: EditProfileSchema) => {
  const [error, result] = await updateProfileById(values);

  revalidatePath("/");

  return [error ? error.serialize() : null, result] as const;
};
