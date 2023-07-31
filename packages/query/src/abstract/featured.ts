import * as z from "zod";
import { ServerError, ServerErrorType } from "@nonovel/lib";
import { getFeaturedPopularPrepared } from "../prepared";

export interface GetFeaturedPopularOpts {
  period: "day" | "week" | "month";
}

export const getFeaturedPopular = async (opts: GetFeaturedPopularOpts) => {
  try {
    const parsed = z
      .object({
        period: z.enum(["day", "week", "month"]),
      })
      .parse(opts);

    const result = await getFeaturedPopularPrepared.execute(parsed);

    return [null, result] as const;
  } catch (err) {
    console.log(err);
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetFeaturedPopularReturn = Awaited<
  ReturnType<typeof getFeaturedPopular>
>;
