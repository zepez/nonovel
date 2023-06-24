import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import config from "@nonovel/config-server";
import { db } from "@nonovel/db";
import adapter from "@nonovel/drizzle-adapter";
import { getUserById } from "@nonovel/query";

const authOptions: NextAuthOptions = {
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
        picture: userData.image,
      };
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
