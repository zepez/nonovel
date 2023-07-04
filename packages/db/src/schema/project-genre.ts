import { pgTable, uuid, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { InferModel, relations } from "drizzle-orm";

import { project, genre } from "./index";

export const projectGenre = pgTable(
  "project_genres",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => project.id)
      .notNull(),
    genreId: uuid("genre_id")
      .notNull()
      .references(() => genre.id)
      .notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (pg) => {
    return {
      uniqueProjectGenreIds: uniqueIndex("unique_project_genre_ids").on(
        pg.projectId,
        pg.genreId
      ),
    };
  }
);

export const projectGenreRelations = relations(projectGenre, ({ one }) => ({
  project: one(project, {
    fields: [projectGenre.projectId],
    references: [project.id],
  }),
  genre: one(genre, {
    fields: [projectGenre.genreId],
    references: [genre.id],
  }),
}));

export type ProjectGenre = InferModel<typeof projectGenre>;
export type NewProjectGenre = InferModel<typeof projectGenre, "insert">;
