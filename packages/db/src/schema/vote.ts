import {
  pgTable,
  uuid,
  timestamp,
  index,
  uniqueIndex,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";
import { InferModel, relations } from "drizzle-orm";

import { user } from "./index";

export const voteResourceType = pgEnum("voteResourcetype", [
  "review",
  "chapter",
  "comment",
]);

export const vote = pgTable(
  "vote",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    resourceType: voteResourceType("resource_type").notNull(),
    resourceId: uuid("resource_id").notNull(),
    userId: uuid("user_id").notNull(),
    value: integer("value").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (v) => {
    return {
      voteUserIdIndex: index("vote_user_id_index").on(v.userId),
      voteResourceIdIndex: index("vote_resource_id_index").on(v.resourceId),
      voteIdsIndex: uniqueIndex("vote_ids_index").on(v.userId, v.resourceId),
    };
  }
);

export const voteRelations = relations(vote, ({ one }) => ({
  user: one(user, {
    fields: [vote.userId],
    references: [user.id],
  }),
}));

export type Vote = InferModel<typeof vote>;
export type NewVote = InferModel<typeof vote, "insert">;
