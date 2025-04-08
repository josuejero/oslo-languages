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
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // If the URL starts with the base URL, prioritize that
      if (url.startsWith(baseUrl)) return url;
      
      // Handle admin login special case
      if (url.includes("/admin/login")) return baseUrl + "/admin/login";
      
      // By default, redirect to dashboard after login
      if (url.includes("/api/auth") || url === baseUrl) return baseUrl + "/admin/dashboard";
      
      // Fallback to the original URL
      return url;
    },
    async jwt({ token, user }) {
      // Add admin flag to token
      if (user) {
        token.isAdmin = true;
      }
      return token;
    },
    async session({ session, token }) {
      // Add admin flag to session
      if (token) {
        session.user = session.user || {};
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };