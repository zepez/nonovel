"use server";

import { revalidatePath } from "next/cache";

import {
  createFollow,
  deleteFollow,
  CreateFollowOptions,
  DeleteFollowOptions,
} from "@nonovel/query";
import { authorizeServerAction } from "~/lib/auth";

interface CreateOpts extends CreateFollowOptions {
  action: "create";
}

interface DeleteOpts extends DeleteFollowOptions {
  action: "delete";
}

type FollowOpts = CreateOpts | DeleteOpts;

export const follow = async (values: FollowOpts) => {
  await authorizeServerAction({ userId: values.userId });

  const [error] =
    values.action === "create"
      ? await createFollow(values)
      : await deleteFollow(values);

  revalidatePath("/");

  return [error ? error.serialize() : null, null] as const;
};
