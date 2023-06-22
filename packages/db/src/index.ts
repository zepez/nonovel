import { drizzle } from "drizzle-orm/node-postgres";
import {
  pgTable,
  uuid,
  timestamp,
  uniqueIndex,
  text,
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import pg from "pg";

const { Pool } = pg;

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

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
    expires: timestamp("expires").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
    expires: timestamp("expires").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
    email: text("email"),
    emailVerified: timestamp("email_verified"),
    image: text("image"),
    username: text("username"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (u) => {
    return {
      uniqueUserEmail: uniqueIndex("unique_user_email").on(u.email),
    };
  }
);

export type User = InferModel<typeof user>;
export type NewUser = InferModel<typeof user, "insert">;

export const insertUserSchema = createInsertSchema(user, {
  email: (schema) => schema.email.email(),
}).pick({ name: true, email: true, username: true });

export const selectUserSchema = createSelectSchema(user);

// ########################################################

export const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING as string,
});

export const db = drizzle(pool, { logger: true });
