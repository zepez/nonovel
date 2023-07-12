import {
  pgTable,
  uuid,
  timestamp,
  uniqueIndex,
  text,
} from "drizzle-orm/pg-core";
import { InferModel, relations } from "drizzle-orm";

import { user, project } from "./index";
import { numberNumeric } from "../columns";

export const review = pgTable(
  "review",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    projectId: uuid("project_id")
      .notNull()
      .references(() => project.id),
    score: numberNumeric("score", { precision: 2, scale: 1 }).notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (r) => {
    return {
      uniqueReviewIds: uniqueIndex("unique_review_ids").on(
        r.userId,
        r.projectId
      ),
    };
  }
);

export const reviewRelations = relations(review, ({ one }) => ({
  user: one(user, {
    fields: [review.userId],
    references: [user.id],
  }),
  project: one(project, {
    fields: [review.projectId],
    references: [project.id],
  }),
}));

export type Review = InferModel<typeof review>;
export type NewReview = InferModel<typeof review, "insert">;
