import {
  pgTable,
  uuid,
  timestamp,
  uniqueIndex,
  text,
} from "drizzle-orm/pg-core";
import { InferModel, relations } from "drizzle-orm";

import { projectGenre } from "./index";

export const genre = pgTable(
  "genre",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (g) => {
    return {
      uniqueGenreSlug: uniqueIndex("unique_genre_slug").on(g.slug),
      uniqueGenreName: uniqueIndex("unique_genre_name").on(g.name),
    };
  }
);

export const genreRelations = relations(genre, ({ many }) => ({
  projects: many(projectGenre),
}));

export type Genre = InferModel<typeof genre>;
export type NewGenre = InferModel<typeof genre, "insert">;
