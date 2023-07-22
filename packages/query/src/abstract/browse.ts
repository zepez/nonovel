import * as z from "zod";

import { ServerError, ServerErrorType } from "@nonovel/lib";
import { getBrowsePageRecentResultPrepared } from "../prepared";

export interface GetBrowsePageResultOptions {
  query: string | null;
  genre: string | null;
  sort: string;
  page: number;
  pageSize: number;
}

export const getBrowsePageResult = async (opts: GetBrowsePageResultOptions) => {
  try {
    const parsed = z
      .object({
        query: z.preprocess(
          (q) => (q === "" ? null : q),
          z.string().nullable()
        ),
        genre: z.string().nullable(),
        sort: z.enum(["recent", "popular", "rating"]),
        page: z.number().positive(),
        pageSize: z.number().positive(),
      })
      .parse(opts);

    const result = await getBrowsePageRecentResultPrepared.execute({
      ...parsed,
      limit: parsed.pageSize + 1,
      offset: parsed.pageSize * (parsed.page - 1),
    });

    return [null, result] as const;
  } catch (err) {
    console.error(err);
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetBrowsePageResultReturn = Awaited<
  ReturnType<typeof getBrowsePageResult>
>;
