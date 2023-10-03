import type { Project, Chapter, User } from "@nonovel/db";
import { ServerError, ServerErrorType } from "@nonovel/lib";
import {
  getChapterBySlugsPrepared,
  getChapterByOrderPrepared,
  getChapterManifestByIdsPrepared,
} from "../prepared";
import {
  project as projectValidator,
  chapter as chapterValidator,
} from "@nonovel/validator";

export interface GetChapterBySlugsOptions {
  project: Project["slug"];
  chapter: Chapter["slug"];
}

export const getChapterBySlugs = async (opts: GetChapterBySlugsOptions) => {
  try {
    const maybeChapterNumber = parseInt(opts.chapter);
    const chapterNumber =
      typeof maybeChapterNumber === "number" && !isNaN(maybeChapterNumber)
        ? maybeChapterNumber
        : null;

    const { slug: project } = projectValidator.pick({ slug: true }).parse({
      slug: opts.project,
    });
    const { slug: chapterSlug } = chapterValidator.pick({ slug: true }).parse({
      slug: opts.chapter,
    });

    const result = chapterNumber
      ? await getChapterByOrderPrepared.execute({
          project,
          chapter: chapterNumber,
        })
      : await getChapterBySlugsPrepared.execute({
          project,
          chapter: chapterSlug,
        });

    return [null, result ?? null] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetChapterBySlugsReturn = Awaited<
  ReturnType<typeof getChapterBySlugs>
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
