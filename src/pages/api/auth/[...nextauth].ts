// src/pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { logger } from '@/utils/logger';

// Module augmentation for NextAuth to add the custom "role" property
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role?: string;
      image?: string | null;
    }
  }
  // Extend the User interface so that user.role is available
  interface User {
    role?: string;
  }
}

// Module augmentation for the JWT token to include a custom user object with role
declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      email: string;
      name: string;
      role?: string;
    }
  }
}

// Enhanced debug function with timestamps
const debug = (message: string, data: Record<string, unknown> = {}): void => {
  logger.info(`[NextAuth] ${message}`, {
    ...data,
    timestamp: new Date().toISOString(),
  });
};

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Basic validation
          if (!credentials?.email || !credentials?.password) {
            debug('Auth failed: Missing credentials');
            return null;
          }

          // Get environment variables
          const adminEmail = process.env.ADMIN_EMAIL;
          // Get password hash from environment, or use development password
          const storedHash = process.env.ADMIN_PASSWORD_HASH;
          const plainPassword = process.env.ADMIN_PASSWORD;

          debug('Environment variables check', {
            adminEmailPresent: !!adminEmail,
            storedHashPresent: !!storedHash,
            plainPasswordPresent: !!plainPassword,
            hashFormat: storedHash?.startsWith('$2') ? 'valid bcrypt' : 'invalid format'
          });

          // Check required environment variables
          if (!adminEmail) {
            debug('Auth failed: Missing admin email environment variable');
            return null;
          }

          // Check email match
          const inputEmail = credentials.email.toLowerCase();
          const configEmail = adminEmail.toLowerCase();
          if (inputEmail !== configEmail) {
            debug('Auth failed: Email mismatch');
            return null;
          }

          // For development/testing, allow plain password authentication
          if (process.env.NODE_ENV === 'development' && plainPassword) {
            if (credentials.password === plainPassword) {
              debug('Plain password authentication successful (development mode)');
              return {
                id: '1',
                email: credentials.email,
                name: 'Admin',
                role: 'admin'
              };
            }
          }

          // For production, require bcrypt hash
          if (storedHash) {
            try {
              // Fix hash format if needed (replace periods with forward slashes)
              const fixedHash = storedHash.replace(/\./g, '/');
              const isValid = await bcrypt.compare(credentials.password, fixedHash);
              
              if (isValid) {
                debug('Bcrypt password authentication successful');
                return {
                  id: '1',
                  email: credentials.email,
                  name: 'Admin',
                  role: 'admin'
                };
              }
            } catch (bcryptError) {
              debug('Password verification error', {
                error: bcryptError instanceof Error ? bcryptError.message : String(bcryptError)
              });
            }
          }
          
          debug('Authentication failed - credentials invalid');
          return null;
        } catch (error) {
          debug('Unexpected error during authentication', {
            error: error instanceof Error ? error.message : String(error)
          });
          return null;
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60 // 24 hours
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email || '',
          name: user.name || '',
          role: user.role || 'user'
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = {
          id: token.user.id,
          email: token.user.email,
          name: token.user.name,
          role: token.user.role
        };
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development'
});