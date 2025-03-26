// src/pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { logAuth } from '../../../utils/debug/auth-logger.js';

// Log environment variables (sanitized) - simpler approach
console.log('[NextAuth] Initializing with admin credentials:', {
  adminEmailExists: !!process.env.ADMIN_EMAIL,
  adminPasswordHashExists: !!process.env.ADMIN_PASSWORD_HASH,
  nodeEnv: process.env.NODE_ENV
});

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          // Start logging authentication process
          console.log('Auth request received', {
            hasCredentials: !!credentials,
            method: req?.method
          });

          if (!credentials?.email || !credentials?.password) {
            console.log('Auth failed: Missing credentials');
            return null;
          }
          
          // Compare email
          if (credentials.email !== process.env.ADMIN_EMAIL) {
            console.log('Auth failed: Email mismatch');
            return null;
          }
          
          // Verify password
          const isValid = await bcrypt.compare(
            credentials.password,
            process.env.ADMIN_PASSWORD_HASH || ''
          );
          
          console.log('Password validation completed', {
            isValid,
            passwordLength: credentials.password.length
          });
          
          // Return user if authentication succeeds
          if (isValid) {
            console.log('Authentication successful');
            return {
              id: '1',
              email: credentials.email,
              name: 'Admin'
            };
          }
          
          console.log('Authentication failed - password mismatch');
          return null;
        } catch (error) {
          console.error('Password verification error', 
            error instanceof Error ? error.message : String(error)
          );
          return null;
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login', // Redirect back to login page with error
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback', {
        hasToken: !!token,
        hasUser: !!user
      });
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback', {
        hasSession: !!session,
        hasToken: !!token
      });
      session.user = token.user;
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development',
});