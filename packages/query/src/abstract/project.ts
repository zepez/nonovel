import { type Project } from "@nonovel/db";
import { ServerError, ServerErrorType } from "@nonovel/lib";
import { getProjectByIdPrepared } from "../prepared";
import { project as validator } from "@nonovel/validator";

export interface GetProjectByIdOptions {
  slug: Project["slug"];
}

export const getProjectById = async (opts: GetProjectByIdOptions) => {
  try {
    const parsed = validator.pick({ slug: true }).parse(opts);

    const result = (await getProjectByIdPrepared.execute(parsed)) ?? null;

    return [null, result] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetProjectByIdReturn = Awaited<ReturnType<typeof getProjectById>>;
