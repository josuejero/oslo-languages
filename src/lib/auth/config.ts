// src/lib/auth/config.ts
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { JWT } from 'next-auth/jwt';
import { DefaultSession } from 'next-auth';

interface User {
  id: string;
  email: string;
  role: string;
}

interface ExtendedSession extends DefaultSession {
  user: {
    role?: string;
  } & DefaultSession['user'];
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        // In production, validate against your database
        const isValid = credentials.email === process.env.ADMIN_EMAIL &&
          await bcrypt.compare(credentials.password, process.env.ADMIN_PASSWORD || '');

        if (isValid) {
          return {
            id: '1',
            email: credentials.email,
            role: 'admin'
          };
        }

        return null;
      }
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user: User | null }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: ExtendedSession, token: JWT }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
};