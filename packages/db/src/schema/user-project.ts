import {
  pgTable,
  uuid,
  timestamp,
  uniqueIndex,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { InferModel, relations } from "drizzle-orm";

import { user, project } from "./index";

export const userProjectRole = pgEnum("project_role", [
  "author",
  "editor",
  "moderator",
]);

export const userProject = pgTable(
  "user_projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => project.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    role: userProjectRole("role").default("author").notNull(),
    owner: boolean("owner").default(true).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (up) => {
    return {
      uniqueUserProjectIds: uniqueIndex("unique_user_project_ids").on(
        up.userId,
        up.projectId
      ),
    };
  }
);

export const userProjectRelations = relations(userProject, ({ one }) => ({
  user: one(user, {
    fields: [userProject.userId],
    references: [user.id],
  }),
  project: one(project, {
    fields: [userProject.projectId],
    references: [project.id],
  }),
}));

export type UserProject = InferModel<typeof userProject>;
export type NewUserProject = InferModel<typeof userProject, "insert">;
