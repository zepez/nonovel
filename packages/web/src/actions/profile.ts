"use server";

import { revalidatePath } from "next/cache";

import { updateProfileById } from "@nonovel/query";
import { authorizeServerAction } from "~/lib/auth";
import type { EditProfileSchema } from "~/components/settings";

interface UpdateProfileOptions extends EditProfileSchema {
  revalidate: string;
}

export const updateProfile = async (values: UpdateProfileOptions) => {
  await authorizeServerAction({ userId: values.userId });

  const [error, result] = await updateProfileById(values);

  revalidatePath(values.revalidate);

  return [error ? error.serialize() : null, result] as const;
};
