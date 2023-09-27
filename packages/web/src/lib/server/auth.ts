import { cache } from "react";
import { cookies, headers } from "next/headers";
import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import config from "@nonovel/config-server";
import { db } from "@nonovel/db";
import adapter from "@nonovel/drizzle-adapter";
import { getUserById, getProfileByUserId } from "~/lib/server";

export type Session = {
  user: NonNullable<Awaited<ReturnType<typeof getUserById>>[1]>;
  profile: NonNullable<Awaited<ReturnType<typeof getProfileByUserId>>[1]>;
};

export const getSession = cache(async () => {
  const { user: session = null } = (await getServerSession(options)) ?? {};

  if (!session?.id) return [null, null] as const;

  // get user
  const [userError, user] = await getUserById({ id: session.id });
  if (userError || !user) return [userError, null] as const;

  // get profile
  const [profileError, profile] = await getProfileByUserId({ id: user.id });
  if (profileError || !profile) return [profileError, null] as const;

  // return formatted session
  return [null, { user, profile } as Session] as const;
});

// TODO: This is a hack to get the session in server actions
// remove this when upstream issue is fixed
// remove explicit any and empty methods
export const getActionSession = async () => {
  const req = {
    headers: Object.fromEntries(headers() as Headers),
    cookies: Object.fromEntries(
      cookies()
        .getAll()
        .map((c) => [c.name, c.value])
    ),
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const res = { getHeader() {}, setCookie() {}, setHeader() {} };

  const { user } =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    (await getServerSession(req as any, res as any, options)) ?? {};

  return user;
};

interface AuthorizeServerActionOptions {
  userId?: string;
  optional?: boolean;
}

export const authorizeServerAction = async ({
  userId,
  optional,
}: AuthorizeServerActionOptions) => {
  const { id } = (await getActionSession()) ?? {};

  if (id && userId && userId !== id) {
    throw new Error("Unauthorized");
  }

  if (!id && !optional) {
    throw new Error("Unauthorized");
  }

  return true;
};

export const options: NextAuthOptions = {
  adapter: adapter(db),
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/error", // Error code passed in query string as ?error=
    // verifyRequest: "/api/auth/verify-request", // (used for check email message)
    // newUser: "/api/auth/new-user",
  },
  providers: [
    GithubProvider({
      clientId: config.NEXTAUTH_GITHUB_CLIENT_ID,
      clientSecret: config.NEXTAUTH_GITHUB_CLIENT_SECRET,
    }),
    DiscordProvider({
      clientId: config.NEXTAUTH_DISCORD_CLIENT_ID,
      clientSecret: config.NEXTAUTH_DISCORD_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  debug: false,
  callbacks: {
    session({ token, session }) {
      if (!token) return session;
      const { user = {} } = session;

      Object.assign(user, token);

      return { ...session, user };
    },
    async jwt({ token, user }) {
      if (!user?.id) return token;

      const [userErr, userData] = await getUserById({ id: user.id });
      if (userErr || !userData) return token;

      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      };
    },
  },
};
