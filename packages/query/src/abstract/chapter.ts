import type { Project, Chapter, User } from "@nonovel/db";
import { ServerError, ServerErrorType } from "@nonovel/lib";
import {
  getChapterBySlugAndOrderPrepared,
  getChapterManifestByIdsPrepared,
} from "../prepared";
import {
  project as projectValidator,
  chapter as chapterValidator,
} from "@nonovel/validator";

export interface GetChapterBySlugAndOrderOptions {
  slug: Project["slug"];
  order: Chapter["order"];
}

export const getChapterBySlugAndOrder = async (
  opts: GetChapterBySlugAndOrderOptions
) => {
  try {
    const { slug } = projectValidator.pick({ slug: true }).parse(opts);
    const { order } = chapterValidator
      .pick({ order: true })
      .parse({ order: opts.order });

    const result =
      (await getChapterBySlugAndOrderPrepared.execute({ slug, order })) ?? null;

    return [null, result] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetChapterBySlugAndOrderReturn = Awaited<
  ReturnType<typeof getChapterBySlugAndOrder>
>;

// ########################################

export interface GetChapterManifestByIdsOptions {
  projectId: Chapter["projectId"];
  userId?: User["id"];
}

export const getChapterManifestByIds = async (
  opts: GetChapterManifestByIdsOptions
) => {
  try {
    const { projectId } = chapterValidator
      .pick({ projectId: true })
      .parse(opts);
    const { userId = null } = opts;

    const result =
      (await getChapterManifestByIdsPrepared.execute({
        projectId,
        userId,
      })) ?? null;

    return [null, result] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetChapterManifestByIdsReturn = Awaited<
  ReturnType<typeof getChapterManifestByIds>
>;
