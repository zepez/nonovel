"use server";

import { revalidatePath } from "next/cache";

import {
  upsertVote as upsertVoteQuery,
  UpsertVoteOptions,
} from "@nonovel/query";
import { authorizeServerAction } from "~/lib/server";

interface UpsertVoteOpts extends UpsertVoteOptions {
  revalidate: string;
}

export const upsertVote = async (opts: UpsertVoteOpts) => {
  await authorizeServerAction({ userId: opts.userId });

  const [error] = await upsertVoteQuery(opts);

  revalidatePath(opts.revalidate);

  return [error ? error.serialize() : null, null] as const;
};
