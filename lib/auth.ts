import type { NextAuthConfig } from "next-auth";

import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
} from "@/drizzle/schema";

export const authConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },

  session: {
    strategy: "database",
  },

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },

    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;

      const pathname = request.nextUrl.pathname;

      const protectedRoutes = [
        "/dashboard",
        "/habits",
        "/analytics",
        "/reports",
        "/recommendations",
        "/goals",
        "/streaks",
        "/notifications",
        "/profile",
      ];

      const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route),
      );

      if (isProtected && !isLoggedIn) {
        return false;
      }

      return true;
    },
  },

  trustHost: true,
} satisfies NextAuthConfig;
