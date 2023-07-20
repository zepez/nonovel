import { db, vote } from "@nonovel/db";
import { placeholder, and, eq } from "drizzle-orm";

export const upsertVotePrepared = db
  .insert(vote)
  .values({
    userId: placeholder("userId"),
    resourceId: placeholder("resourceId"),
    resourceType: placeholder("resourceType"),
    value: placeholder("value"),
  })
  .onConflictDoUpdate({
    target: [vote.userId, vote.resourceId],
    set: {
      value: placeholder("value") as unknown as number,
    },
  })
  .prepare("upsert_vote_prepared");

export const deleteVotePrepared = db
  .delete(vote)
  .where(
    and(
      eq(vote.userId, placeholder("userId")),
      eq(vote.resourceId, placeholder("resourceId"))
    )
  )
  .prepare("delete_vote_prepared");
