"use server";

import { updateUserById } from "@nonovel/query";
import type { EditAccountSchema } from "~/components/settings";

export const updateAccount = async (values: EditAccountSchema) => {
  const [error, result] = await updateUserById(values);

  return [error ? error.serialize() : null, result] as const;
};
