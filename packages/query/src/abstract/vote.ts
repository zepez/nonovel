import type { Vote } from "@nonovel/db";
import { ServerError, ServerErrorType } from "@nonovel/lib";
import { upsertVotePrepared, deleteVotePrepared } from "../prepared";
import { vote as voteValidator } from "@nonovel/validator";

export interface UpsertVoteOptions {
  userId: Vote["userId"];
  resourceId: Vote["resourceId"];
  resourceType: Vote["resourceType"];
  direction: "up" | "down";
  voteCurrent: number;
}

export const upsertVote = async (opts: UpsertVoteOptions) => {
  try {
    let value = 0;

    if (opts.direction === "up") {
      value = opts.voteCurrent > 0 ? 0 : 1;
    } else if (opts.direction === "down") {
      value = opts.voteCurrent < 0 ? 0 : -1;
    }

    const parsed = voteValidator
      .pick({ userId: true, resourceId: true, resourceType: true, value: true })
      .parse({ ...opts, value });

    if (parsed.value === 0) await deleteVotePrepared.execute(parsed);
    else await upsertVotePrepared.execute(parsed);

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
