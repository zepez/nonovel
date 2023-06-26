import {
  pgTable,
  uuid,
  timestamp,
  uniqueIndex,
  text,
  boolean,
  pgEnum,
  numeric,
  varchar,
} from "drizzle-orm/pg-core";
import { InferModel, relations } from "drizzle-orm";

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

// ########################################################

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

// ########################################################

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

// ########################################################

export const user = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name"),
    email: varchar("email", { length: 256 }),
    emailVerified: timestamp("email_verified", { withTimezone: true }),
    image: text("image"),
    username: varchar("username", { length: 32 }),
    description: text("description"),

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
      uniqueUserUsername: uniqueIndex("unique_user_username").on(u.username),
    };
  }
);

export const userRelations = relations(user, ({ many }) => ({
  projects: many(userProject),
}));

export type User = InferModel<typeof user>;
export type NewUser = InferModel<typeof user, "insert">;

// ########################################################

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

// ########################################################

export const project = pgTable(
  "project",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name"),
    slug: text("slug"),
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
  users: many(userProject),
  chapters: many(chapter),
}));

export type Project = InferModel<typeof project>;
export type NewProject = InferModel<typeof project, "insert">;

// ########################################################

export const chapterContentType = pgEnum("chapter_content_type", [
  "html",
  "md",
]);

export const chapter = pgTable("chapter", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => project.id),
  name: text("name"),
  order: numeric("order", { precision: 9, scale: 3 }),
  contentType: chapterContentType("content_type").default("html").notNull(),
  content: text("content"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const chapterRelations = relations(chapter, ({ one }) => ({
  project: one(project, {
    fields: [chapter.projectId],
    references: [project.id],
  }),
}));

export type Chapter = InferModel<typeof chapter>;
export type NewChapter = InferModel<typeof chapter, "insert">;
