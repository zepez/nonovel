import { ServerError, ServerErrorType } from "@nonovel/lib";
import { getOmniSearchResultPrepared } from "../prepared";
import { search as validator } from "@nonovel/validator";

export interface GetOmniSearchResultOptions {
  query: string;
}

export const getOmniSearchResult = async (opts: GetOmniSearchResultOptions) => {
  try {
    const parsed = validator.pick({ query: true }).parse(opts);

    const result = await getOmniSearchResultPrepared.execute(parsed);

    return [null, result] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetOmniSearchResultReturn = Awaited<
  ReturnType<typeof getOmniSearchResult>
>;
