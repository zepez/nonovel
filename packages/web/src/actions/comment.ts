"use server";

import { revalidatePath } from "next/cache";

import {
  getCommentPageByResourceId as getCommentPageByResourceIdQuery,
  GetCommentPageByResourceIdOptions,
  getCommentRepliesByParentId as getCommentRepliesByParentIdQuery,
  GetCommentRepliesByParentIdOptions,
  createComment as createCommentQuery,
  CreateCommentOptions,
  deleteComment as deleteCommentQuery,
  DeleteCommentOptions,
} from "@nonovel/query";
import { authorizeServerAction } from "~/lib/auth";

export const getCommentPage = async (
  values: GetCommentPageByResourceIdOptions
) => {
  const [error, result] = await getCommentPageByResourceIdQuery(values);

  return [error ? error.serialize() : null, result] as const;
};

export const getCommentReplies = async (
  values: GetCommentRepliesByParentIdOptions
) => {
  const [error, result] = await getCommentRepliesByParentIdQuery(values);

  return [error ? error.serialize() : null, result] as const;
};

interface CreateCommentActionOpts extends CreateCommentOptions {
  revalidate: string;
}

export const createComment = async (values: CreateCommentActionOpts) => {
  await authorizeServerAction({ userId: values.userId });

  const [error, result] = await createCommentQuery(values);

  revalidatePath(values.revalidate);

  return [error ? error.serialize() : null, result] as const;
};

interface DeleteCommentActionOpts extends DeleteCommentOptions {
  revalidate: string;
}

export const deleteComment = async (values: DeleteCommentActionOpts) => {
  await authorizeServerAction({ userId: values.userId });

  const [error, result] = await deleteCommentQuery(values);

  revalidatePath(values.revalidate);

  return [error ? error.serialize() : null, result] as const;
};
