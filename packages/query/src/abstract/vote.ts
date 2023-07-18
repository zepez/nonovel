import type { Vote } from "@nonovel/db";
import { ServerError, ServerErrorType } from "@nonovel/lib";
import { upsertVotePrepared } from "../prepared";
import { vote as voteValidator } from "@nonovel/validator";

export interface UpsertVoteOptions {
  userId: Vote["userId"];
  resourceId: Vote["resourceId"];
  resourceType: Vote["resourceType"];
  value: Vote["value"];
}

export const upsertVote = async (opts: UpsertVoteOptions) => {
  try {
    const parsed = voteValidator
      .pick({ userId: true, resourceId: true, resourceType: true, value: true })
      .parse(opts);

    await upsertVotePrepared.execute(parsed);

    return [null, null] as const;
  } catch (err) {
    const error = new ServerError(
      "CreateResourceError",
      err as ServerErrorType
    );
    return [error, null] as const;
  }
};

export type UpsertVoteReturn = Awaited<ReturnType<typeof upsertVote>>;
