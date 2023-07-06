import {
  pgTable,
  uuid,
  timestamp,
  uniqueIndex,
  text,
} from "drizzle-orm/pg-core";
import { InferModel, relations } from "drizzle-orm";

import { userProject, projectGenre, chapter, follow } from "./index";

export const project = pgTable(
  "project",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cover: text("cover"),
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
  (p) => {
    return {
      uniqueProjectSlug: uniqueIndex("unique_project_slug").on(p.slug),
    };
  }
);

export const projectRelations = relations(project, ({ many }) => ({
  chapters: many(chapter),
  follows: many(follow),
  genres: many(projectGenre),
  users: many(userProject),
}));

export type Project = InferModel<typeof project>;
export type NewProject = InferModel<typeof project, "insert">;
