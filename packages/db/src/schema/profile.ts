import {
  pgTable,
  uuid,
  timestamp,
  uniqueIndex,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { InferModel, relations } from "drizzle-orm";

import { user } from "./index";

export const profile = pgTable(
  "profile",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    image: text("image"),
    username: varchar("username", { length: 32 }).notNull(),
    bio: text("bio"),
    countryCode: varchar("country_code", { length: 2 }),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (p) => {
    return {
      uniqueUserUsername: uniqueIndex("unique_profile_username").on(p.username),
    };
  }
);

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(user, {
    fields: [profile.userId],
    references: [user.id],
  }),
}));

export type Profile = InferModel<typeof profile>;
export type NewProfile = InferModel<typeof profile, "insert">;
