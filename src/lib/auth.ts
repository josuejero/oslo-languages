// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = true;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = session.user || {};
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },

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