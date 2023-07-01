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
  projects: many(userProject),
  user: one(user),
}));

export type User = InferModel<typeof user>;
export type NewUser = InferModel<typeof user, "insert">;

// ########################################################

export const profile = pgTable(
  "profile",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    image: text("image"),
    username: varchar("username", { length: 32 }).notNull(),
    bio: text("bio"),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id)
      .notNull(),

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
      .references(() => project.id)
      .notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id)
      .notNull(),
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
    .references(() => project.id)
    .notNull(),
  name: text("name").notNull(),
  order: numeric("order", { precision: 9, scale: 3 }).notNull(),
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
