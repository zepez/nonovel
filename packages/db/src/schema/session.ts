import {
  pgTable,
  uuid,
  timestamp,
  uniqueIndex,
  text,
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";

import { user } from "./index";

export const session = pgTable(
  "session",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionToken: text("session_token").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    expires: timestamp("expires", { withTimezone: true }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (s) => {
    return {
      uniqueSessionToken: uniqueIndex("unique_session_token").on(
        s.sessionToken
      ),
    };
  }
);

export type Session = InferModel<typeof session>;
export type NewSession = InferModel<typeof session, "insert">;
