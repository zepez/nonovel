"use server";

import { updateProfileById } from "@nonovel/query";
import type { EditProfileSchema } from "~/components/settings";

export const updateProfile = async (values: EditProfileSchema) => {
  const [error, result] = await updateProfileById(values);

  return [error ? error.serialize() : null, result] as const;
};
