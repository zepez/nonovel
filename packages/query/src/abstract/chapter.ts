import type { Project, Chapter } from "@nonovel/db";
import { ServerError, ServerErrorType } from "@nonovel/lib";
import {
  getChapterBySlugAndOrderPrepared,
  getChapterManifestByProjectIdPrepared,
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
      .parse({ order: parseInt(opts.order) });

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

export interface GetChapterManifestByProjectIdOptions {
  projectId: Project["id"];
}

export const getChapterManifestByProjectId = async (
  opts: GetChapterManifestByProjectIdOptions
) => {
  try {
    const parsed = chapterValidator.pick({ projectId: true }).parse(opts);

    const result =
      (await getChapterManifestByProjectIdPrepared.execute(parsed)) ?? null;

    return [null, result] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetChapterManifestByProjectIdReturn = Awaited<
  ReturnType<typeof getChapterManifestByProjectId>
>;
