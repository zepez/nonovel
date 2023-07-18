import {
  pgTable,
  uuid,
  timestamp,
  uniqueIndex,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { InferModel, relations } from "drizzle-orm";

import {
  userProject,
  profile,
  follow,
  userChapterView,
  review,
  comment,
  vote,
} from "./index";

export const user = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    emailVerified: timestamp("email_verified", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (u) => {
    return {
      uniqueUserEmail: uniqueIndex("unique_user_email").on(u.email),
    };
  }
);

export const userRelations = relations(user, ({ many, one }) => ({
  follows: many(follow),
  profile: one(profile),
  projects: many(userProject),
  userChapterViews: many(userChapterView),
  reviews: many(review),
  comments: many(comment),
  votes: many(vote),
}));

export type User = InferModel<typeof user>;
export type NewUser = InferModel<typeof user, "insert">;
