import { ServerError, ServerErrorType } from "@nonovel/lib";
import { getGenreManifestPrepared, getGenreBySlugPrepared } from "../prepared";
import { genre as genreValidator } from "@nonovel/validator";

export const getGenreManifest = async () => {
  try {
    const result = await getGenreManifestPrepared.execute();

    return [null, result] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetGenreManifestReturn = Awaited<
  ReturnType<typeof getGenreManifest>
>;

// ########################################################

export interface GetGenreBySlugOptions {
  slug: string;
}

export const getGenreBySlug = async (opts: GetGenreBySlugOptions) => {
  try {
    const parsed = genreValidator.pick({ slug: true }).parse(opts);
    const result = (await getGenreBySlugPrepared.execute(parsed)) ?? null;

    return [null, result] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetGenreBySlugReturn = Awaited<ReturnType<typeof getGenreBySlug>>;
