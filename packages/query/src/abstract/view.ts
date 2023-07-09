import { type Project, type User, type Chapter } from "@nonovel/db";
import { ServerError, ServerErrorType } from "@nonovel/lib";
import {
  createUserChapterViewPrepared,
  createAnonChapterViewPrepared,
  getTotalChapterViewCountByProjectIdPrepared,
} from "../prepared";
import { view as viewValidator } from "@nonovel/validator";

export interface CreateViewOptions {
  userId?: User["id"];
  projectId: Project["id"];
  chapterId: Chapter["id"];
}

export const createView = async (opts: CreateViewOptions) => {
  try {
    const parsed = viewValidator
      .pick({ userId: true, projectId: true, chapterId: true })
      .parse(opts);

    if (parsed.userId) {
      await createUserChapterViewPrepared.execute(parsed);
    } else {
      await createAnonChapterViewPrepared.execute(parsed);
    }

    return [null, null] as const;
  } catch (err) {
    const error = new ServerError(
      "CreateResourceError",
      err as ServerErrorType
    );
    return [error, null] as const;
  }
};

export type CreateViewReturn = Awaited<ReturnType<typeof createView>>;

// ########################################################

export interface GetTotalViewCountByProjectIdOptions {
  projectId: Project["id"];
}

export const getTotalViewCountByProjectId = async (
  opts: GetTotalViewCountByProjectIdOptions
) => {
  try {
    const parsed = viewValidator.pick({ projectId: true }).parse(opts);

    const { count = 0 } =
      (await getTotalChapterViewCountByProjectIdPrepared.execute(parsed))[0] ??
      {};

    return [null, count] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, 0] as const;
  }
};

export type GetTotalViewCountByProjectIdReturn = Awaited<
  ReturnType<typeof getTotalViewCountByProjectId>
>;
