import {
  pgTable,
  uuid,
  timestamp,
  uniqueIndex,
  text,
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";

import { user } from "./index";

export const account = pgTable(
  "account",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: text("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (a) => {
    return {
      uniqueAccountProviderProviderAccountId: uniqueIndex(
        "unique_account_provider_provider_account_id"
      ).on(a.provider, a.providerAccountId),
    };
  }
);

export type Account = InferModel<typeof account>;
export type NewAccount = InferModel<typeof account, "insert">;
