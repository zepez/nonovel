"use server";

import { revalidatePath } from "next/cache";

import {
  createFollow,
  deleteFollow,
  CreateFollowOptions,
  DeleteFollowOptions,
} from "@nonovel/query";
import { authorizeServerAction } from "~/lib/server";

interface CreateOpts extends CreateFollowOptions {
  action: "create";
  revalidate: string;
}

interface DeleteOpts extends DeleteFollowOptions {
  action: "delete";
  revalidate: string;
}

type FollowOpts = CreateOpts | DeleteOpts;

export const follow = async (values: FollowOpts) => {
  await authorizeServerAction({ userId: values.userId });

  const [error] =
    values.action === "create"
      ? await createFollow(values)
      : await deleteFollow(values);

  revalidatePath(values.revalidate);

  return [error ? error.serialize() : null, null] as const;
};
