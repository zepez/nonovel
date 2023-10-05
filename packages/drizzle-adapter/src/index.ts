import { eq, and } from "drizzle-orm";
import type { Adapter, AdapterSession, AdapterUser } from "next-auth/adapters";
import {
  user as userValidator,
  profile as profileValidator,
} from "@nonovel/validator";
import {
  db,
  user,
  profile,
  account,
  session,
  verificationToken,
} from "@nonovel/db";

export default function adapter(client: typeof db): Adapter {
  return {
    async createUser(userData) {
      const [name] = userData.email.split("@");
      const discriminator = Math.random().toString(36).substring(4);
      const username = name ? `${name}_${discriminator}` : discriminator;

      const profileValidated = profileValidator.pick({ username: true }).parse({
        username,
      });

      const userValidated = userValidator
        .pick({ email: true, name: true })
        .parse(userData);

      const [userReturn] = await db
        .insert(user)
        .values({ ...userValidated })
        .returning();

      if (!userReturn) {
        throw new Error("Unable to create user.");
      }

      const [profileReturn] = await db
        .insert(profile)
        .values({ ...profileValidated, userId: userReturn.id })
        .returning();

      if (!profileReturn) {
        throw new Error("Unable to create profile.");
      }

      return userReturn as AdapterUser;
    },
    async getUser(id) {
      const res = await client
        .select({ user })
        .from(user)
        .where(eq(user.id, id))
        .limit(1);

      const resUser = res[0]?.user;
      return (resUser as AdapterUser) ?? null;
    },
    async getUserByEmail(email) {
      const res = await client
        .select({ user })
        .from(user)
        .where(eq(user.email, email))
        .limit(1);

      const resUser = res[0]?.user;
      return (resUser as AdapterUser) ?? null;
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const res = await client
        .select({ user })
        .from(account)
        .leftJoin(user, eq(account.userId, user.id))
        .where(
          and(
            eq(account.providerAccountId, providerAccountId),
            eq(account.provider, provider)
          )
        );

      const resUser = res[0]?.user;
      return (resUser as AdapterUser) ?? null;
    },
    async updateUser({ id, ...userData }) {
      const userValidated = userValidator
        .pick({ email: true, name: true, emailVerified: true })
        .parse(userData);

      const res = await client
        .update(user)
        .set(userValidated)
        .where(eq(user.id, id))
        .returning();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return res[0]! as AdapterUser;
    },
    async deleteUser(userId) {
      await client.delete(user).where(eq(user.id, userId));
    },
    async linkAccount(accountData) {
      const expires_at = accountData.expires_at
        ? accountData.expires_at.toString()
        : null;

      await client.insert(account).values({ ...accountData, expires_at });
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await client
        .delete(account)
        .where(
          and(
            eq(account.providerAccountId, providerAccountId),
            eq(account.provider, provider)
          )
        );
    },
    async createSession(sessionData) {
      const res = await client.insert(session).values(sessionData).returning();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return res[0]!;
    },
    async getSessionAndUser(sessionToken) {
      const resArr = await client
        .select({ session, user })
        .from(session)
        .leftJoin(user, eq(session.userId, user.id))
        .where(eq(session.sessionToken, sessionToken))
        .limit(1);

      const res = resArr[0];
      if (!res) return null;
      if (!res.user) return null;

      return res as { user: AdapterUser; session: AdapterSession };
    },
    async updateSession({ sessionToken }) {
      const res = await client
        .update(session)
        .set({ sessionToken })
        .returning();

      return res[0];
    },
    async deleteSession(sessionToken) {
      await client
        .delete(session)
        .where(eq(session.sessionToken, sessionToken));
    },
    async createVerificationToken(data) {
      const res = await client
        .insert(verificationToken)
        .values(data)
        .returning();

      return res[0];
    },
    async useVerificationToken({ identifier, token }) {
      try {
        const res = await client
          .delete(verificationToken)
          .where(
            and(
              eq(verificationToken.identifier, identifier),
              eq(verificationToken.token, token)
            )
          )
          .returning();

        return res[0] ?? null;
      } catch (e) {
        return null;
      }
    },
  };
}
