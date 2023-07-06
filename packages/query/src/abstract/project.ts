import { type Project } from "@nonovel/db";
import { ServerError, ServerErrorType } from "@nonovel/lib";
import { getProjectBySlugPrepared } from "../prepared";
import { project as validator } from "@nonovel/validator";

export interface GetProjectBySlugOptions {
  slug: Project["slug"];
}

export const getProjectBySlug = async (opts: GetProjectBySlugOptions) => {
  try {
    const parsed = validator.pick({ slug: true }).parse(opts);

    const result = (await getProjectBySlugPrepared.execute(parsed)) ?? null;

    return [null, result] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetProjectBySlugReturn = Awaited<
  ReturnType<typeof getProjectBySlug>
>;
