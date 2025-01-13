// src/lib/auth/config.ts

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Rate limiting for login attempts
const MAXIMUM_LOGIN_ATTEMPTS = 5;
const LOGIN_ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes
const loginAttempts = new Map<string, { count: number; timestamp: number }>();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Invalid credentials');
          }

          // Check rate limiting
          const ipKey = credentials.email.toLowerCase();
          const attempt = loginAttempts.get(ipKey);
          
          if (attempt) {
            if (attempt.count >= MAXIMUM_LOGIN_ATTEMPTS && 
                Date.now() - attempt.timestamp < LOGIN_ATTEMPT_WINDOW) {
              throw new Error('Too many login attempts. Please try again later.');
            }
            if (Date.now() - attempt.timestamp >= LOGIN_ATTEMPT_WINDOW) {
              loginAttempts.delete(ipKey);
            }
          }

          // Compare with environment variables
          const isValidEmail = credentials.email === process.env.ADMIN_EMAIL;
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            process.env.ADMIN_PASSWORD_HASH || ''
          );

          if (!isValidEmail || !isValidPassword) {
            incrementLoginAttempts(ipKey);
            throw new Error('Invalid credentials');
          }

          // Clear login attempts on success
          loginAttempts.delete(ipKey);

          return {
            id: '1',
            email: process.env.ADMIN_EMAIL || '',
            role: 'admin'
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 2 * 60 * 60, // 2 hours
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token }) {
      token.role = 'admin';
      return token;
    },
    async session({ session }) {
      if (session.user) {
        session.user.role = 'admin';
      }
      return session;
    }
  },
};

function incrementLoginAttempts(key: string) {
  const attempt = loginAttempts.get(key);
  if (attempt) {
    attempt.count += 1;
    attempt.timestamp = Date.now();
  } else {
    loginAttempts.set(key, { count: 1, timestamp: Date.now() });
  }
}