"use server";

import { revalidatePath } from "next/cache";

import {
  upsertReview,
  UpsertReviewOptions,
  deleteReviewById,
  DeleteReviewByIdOptions,
} from "@nonovel/query";
import { authorizeServerAction } from "~/lib/auth";

interface DoReviewOpts extends UpsertReviewOptions {
  revalidate: string;
}

export const doReview = async (values: DoReviewOpts) => {
  await authorizeServerAction({ userId: values.userId });

  const [error] = await upsertReview(values);

  revalidatePath(values.revalidate);

  return [error ? error.serialize() : null, null] as const;
};

// ########################################################

interface DeleteReviewOpts extends DeleteReviewByIdOptions {
  userId: string;
  revalidate: string;
}

export const deleteReview = async (values: DeleteReviewOpts) => {
  await authorizeServerAction({ userId: values.userId });

  const [error] = await deleteReviewById(values);

  revalidatePath(values.revalidate);

  return [error ? error.serialize() : null, null] as const;
};
