// src/app/api/auth/[...nextauth]/route.ts

import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * 1. Define your NextAuth options with providers, callbacks, etc.
 *    This example includes the `isAdmin` token/session field.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Hardcoded example - use real user lookup in production
        const validCredentials = {
          email: "admin@oslolanguages.no",
          password: "admin123",
        };

        if (
          credentials?.email === validCredentials.email &&
          credentials?.password === validCredentials.password
        ) {
          // Return user object
          return {
            id: "1",
            email: validCredentials.email,
            name: "Admin User",
            // You could also add `isAdmin: true` here if desired
          };
        }
        return null;
      },
    }),
  ],

  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },

  callbacks: {
    /**
     * Attach a custom property (isAdmin) to your JWT based on the user.
     */
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = true;
      }
      return token;
    },

    /**
     * Make isAdmin available in the session for client-side checks.
     */
    async session({ session, token }) {
      if (token) {
        session.user = session.user || {};
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },

    /**
     * Example of a redirect after successful sign-in.
     */
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.includes("/admin/login")) return baseUrl + "/admin/login";
      if (url.includes("/api/auth") || url === baseUrl) return baseUrl + "/admin/dashboard";
      return url;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  debug: process.env.NODE_ENV === "development",
};

/**
 * 2. Create the NextAuth instance from your options.
 */
const handler = NextAuth(authOptions);

/**
 * 3. Export route handlers (GET, POST) as per Next.js 13 recommendations.
 */
export async function GET(request: Request) {
  return handler(request);
}

export async function POST(request: Request) {
  return handler(request);
}
