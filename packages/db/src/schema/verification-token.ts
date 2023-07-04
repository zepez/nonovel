import {
  pgTable,
  uuid,
  timestamp,
  uniqueIndex,
  text,
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";

export const verificationToken = pgTable(
  "verification_token",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (vt) => {
    return {
      uniqueVerificationTokenIdentifierToken: uniqueIndex(
        "unique_verification_token_identifier_token"
      ).on(vt.identifier, vt.token),
      uniqueVerificationTokenToken: uniqueIndex(
        "unique_verification_token_token"
      ).on(vt.token),
    };
  }
);

export type VerificationToken = InferModel<typeof verificationToken>;
export type NewVerificationToken = InferModel<
  typeof verificationToken,
  "insert"
>;
