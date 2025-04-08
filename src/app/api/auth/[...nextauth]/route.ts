// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // For development, use a hardcoded admin account
        const validCredentials = {
          email: "admin@oslolanguages.no",
          password: "admin123", // Change this in production!
        };

        if (
          credentials?.email === validCredentials.email &&
          credentials?.password === validCredentials.password
        ) {
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
  // Critical config to prevent redirects
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  // Prevent the default NextAuth.js callback behavior
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Force all redirects to the base URL to avoid loops
      console.log("NextAuth redirect called with:", { url, baseUrl });
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };