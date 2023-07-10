import type { Follow } from "@nonovel/db";
import { ServerError, ServerErrorType } from "@nonovel/lib";
import {
  createFollowPrepared,
  deleteFollowPrepared,
  getFollowCountByProjectIdPrepared,
  getFollowStatusByIdsPrepared,
} from "../prepared";
import { follow as followValidator } from "@nonovel/validator";

export interface CreateFollowOptions {
  userId: Follow["userId"];
  projectId: Follow["projectId"];
}

export const createFollow = async (opts: CreateFollowOptions) => {
  try {
    const parsed = followValidator
      .pick({ userId: true, projectId: true })
      .parse(opts);

    await createFollowPrepared.execute(parsed);

    return [null, null] as const;
  } catch (err) {
    const error = new ServerError(
      "CreateResourceError",
      err as ServerErrorType
    );
    return [error, null] as const;
  }
};

export type CreateFollowReturn = Awaited<ReturnType<typeof createFollow>>;

// ########################################################

export interface DeleteFollowOptions {
  userId: Follow["userId"];
  projectId: Follow["projectId"];
}

export const deleteFollow = async (opts: DeleteFollowOptions) => {
  try {
    const parsed = followValidator
      .pick({ userId: true, projectId: true })
      .parse(opts);

    await deleteFollowPrepared.execute(parsed);

    return [null, null] as const;
  } catch (err) {
    const error = new ServerError(
      "DeleteResourceError",
      err as ServerErrorType
    );
    return [error, null] as const;
  }
};

export type DeleteFollowReturn = Awaited<ReturnType<typeof deleteFollow>>;

// ########################################################

export interface GetFollowCountByProjectIdOptions {
  projectId: Follow["projectId"];
}

export const getFollowCountByProjectId = async (
  opts: GetFollowCountByProjectIdOptions
) => {
  try {
    const parsed = followValidator.pick({ projectId: true }).parse(opts);

    const result =
      (await getFollowCountByProjectIdPrepared.execute(parsed)) ?? null;
    const { count } = result[0] ?? { count: 0 };

    return [null, count] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, 0] as const;
  }
};

export type GetFollowCountByProjectIdReturn = Awaited<
  ReturnType<typeof getFollowCountByProjectId>
>;

// ########################################################

export interface GetFollowStatusByIdsOptions {
  userId?: Follow["userId"];
  projectId: Follow["projectId"];
}

export const getFollowStatusByIds = async (
  opts: GetFollowStatusByIdsOptions
) => {
  try {
    if (!opts.userId) return [null, null] as const;

    const parsed = followValidator
      .pick({ projectId: true, userId: true })
      .parse(opts);

    const result = (await getFollowStatusByIdsPrepared.execute(parsed)) ?? null;

    return [null, result] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetFollowStatusByIdsReturn = Awaited<
  ReturnType<typeof getFollowStatusByIds>
>;
