// src/pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
const { logAuth } = require('../../../utils/debug/auth-logger');

// Log environment variables (sanitized)
logAuth('NextAuth initializing', {
  adminEmailExists: !!process.env.ADMIN_EMAIL,
  adminEmailLength: process.env.ADMIN_EMAIL?.length,
  adminPasswordHashExists: !!process.env.ADMIN_PASSWORD_HASH,
  adminPasswordHashLength: process.env.ADMIN_PASSWORD_HASH?.length,
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
        // Start logging every step of the auth process
        logAuth('Auth request received', {
          hasCredentials: !!credentials,
          reqMethod: req?.method,
          reqHeaders: req?.headers ? Object.keys(req.headers) : null
        });

        if (!credentials?.email || !credentials?.password) {
          logAuth('Missing credentials', {
            hasEmail: !!credentials?.email,
            hasPassword: !!credentials?.password
          });
          return null;
        }
        
        logAuth('Credentials received', {
          email: credentials.email,
          expectedEmail: process.env.ADMIN_EMAIL,
          emailMatch: credentials.email === process.env.ADMIN_EMAIL,
          passwordLength: credentials.password.length
        });

        // Direct string comparison for email
        if (credentials.email !== process.env.ADMIN_EMAIL) {
          logAuth('Email mismatch', {
            inputEmail: credentials.email,
            expectedEmail: process.env.ADMIN_EMAIL
          });
          return null;
        }
        
        // Log the actual stored hash (for debugging only - remove in production)
        logAuth('Stored password hash', {
          hash: process.env.ADMIN_PASSWORD_HASH
        });

        try {
          // Generate a new hash for the provided password to compare formats
          const newHash = await bcrypt.hash(credentials.password, 12);
          logAuth('Generated new hash for comparison', {
            newHash: newHash,
            currentInputPassword: credentials.password
          });
          
          // Direct bcrypt compare
          logAuth('Attempting password verification');
          const isValid = await bcrypt.compare(
            credentials.password,
            process.env.ADMIN_PASSWORD_HASH || ''
          );
          
          logAuth('Password validation completed', {
            isValid: isValid,
            inputPasswordLength: credentials.password.length,
            storedHashLength: (process.env.ADMIN_PASSWORD_HASH || '').length
          });
          
          // Try direct character by character comparison for debugging
          const storedHash = process.env.ADMIN_PASSWORD_HASH || '';
          logAuth('Hash comparison', {
            storedHashFirstChars: storedHash.substring(0, 10),
            generatedHashFirstChars: newHash.substring(0, 10),
            sameLength: storedHash.length === newHash.length
          });
          
          // If validation passes, return user
          if (isValid) {
            logAuth('Authentication successful');
            return {
              id: '1',
              email: credentials.email,
              name: 'Admin'
            };
          } else {
            logAuth('Authentication failed - password mismatch');
          }
        } catch (error) {
          logAuth('Password verification error', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
          });
        }
        
        return null;
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
      logAuth('JWT callback', {
        hasToken: !!token,
        hasUser: !!user
      });
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      logAuth('Session callback', {
        hasSession: !!session,
        hasToken: !!token
      });
      session.user = token.user;
      return session;
    }
  },
  logger: {
    error(code, ...message) {
      logAuth(`Error: ${code}`, { message });
    },
    warn(code, ...message) {
      logAuth(`Warning: ${code}`, { message });
    },
    debug(code, ...message) {
      logAuth(`Debug: ${code}`, { message });
    },
  },
  debug: true,
  events: {
    async signIn(message) {
      logAuth('SignIn event', message);
    },
    async signOut(message) {
      logAuth('SignOut event', message);
    },
    async createUser(message) {
      logAuth('CreateUser event', message);
    },
    async linkAccount(message) {
      logAuth('LinkAccount event', message);
    },
    async session(message) {
      logAuth('Session event', message);
    },
    async error(message) {
      logAuth('Error event', message);
    }
  }
});