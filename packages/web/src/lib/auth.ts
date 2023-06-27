import { cache } from "react";
import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import config from "@nonovel/config-server";
import { db } from "@nonovel/db";
import adapter from "@nonovel/drizzle-adapter";
import { getUserById, getProfileById } from "~/lib/request";

export type Session = {
  user: NonNullable<Awaited<ReturnType<typeof getUserById>>[1]>;
  profile: NonNullable<Awaited<ReturnType<typeof getProfileById>>[1]>;
};

export const getSession = cache(async () => {
  const { user: session = null } = (await getServerSession(options)) ?? {};

  if (!session?.id) return [null, null] as const;

  // get user
  const [userError, user] = await getUserById({ id: session.id });
  if (userError || !user) return [userError, null] as const;

  // get profile
  const [profileError, profile] = await getProfileById({ id: user.profileId });
  if (profileError || !profile) return [profileError, null] as const;

  // return formatted session
  return [null, { user, profile } as Session] as const;
});

export const options: NextAuthOptions = {
  adapter: adapter(db),
  pages: {
    // signIn: "/api/auth/signin",
    // signOut: "/api/auth/signout",
    // error: "/api/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: "/api/auth/verify-request", // (used for check email message)
    // newUser: "/api/auth/new-user",
  },
  providers: [
    GithubProvider({
      clientId: config.NEXTAUTH_GITHUB_ID,
      clientSecret: config.NEXTAUTH_GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.NEXTAUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXTAUTH_GOOGLE_CLIENT_SECRET as string,
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
