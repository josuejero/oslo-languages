import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import { logger } from '@/utils/logger';

// Module augmentation to add custom properties to Session and JWT
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
}

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

// Enhanced debug function with timestamps and detailed environment context
const debug = (message: string, data: Record<string, unknown> = {}): void => {
  logger.info(`[NextAuth] ${message}`, {
    ...data,
    timestamp: new Date().toISOString(),
    env: {
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nodeEnv: process.env.NODE_ENV,
      ...(process.env.NODE_ENV === 'development'
          ? {
              adminEmail: process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.substring(0, 3) + '...' : undefined,
              hashFirstChars: process.env.ADMIN_PASSWORD_HASH ? process.env.ADMIN_PASSWORD_HASH.substring(0, 10) + '...' : undefined,
              hashLength: process.env.ADMIN_PASSWORD_HASH ? process.env.ADMIN_PASSWORD_HASH.length : 0,
              envFiles: ['.env', '.env.local'].filter(file => {
                try {
                  return fs.existsSync(file);
                } catch {
                  return false;
                }
              })
            }
          : {})
    }
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
          // Basic validation with enhanced logging
          if (!credentials?.email || !credentials?.password) {
            debug('Auth failed: Missing credentials', { 
              hasEmail: !!credentials?.email, 
              hasPassword: !!credentials?.password 
            });
            return null;
          }
          
          // Extended environment variables check
          const adminEmail = process.env.ADMIN_EMAIL;
          const storedHash = process.env.ADMIN_PASSWORD_HASH;
          
          debug('Environment variables check', { 
            adminEmail: adminEmail ? `${adminEmail.substring(0, 3)}...` : undefined, 
            storedHashLength: storedHash?.length || 0,
            storedHashPrefix: storedHash ? storedHash.substring(0, 10) : '',
            storedHashComplete: storedHash || '',
            storedHashPresent: !!storedHash,
            envFiles: ['.env', '.env.local'].filter(file => {
              try {
                return fs.existsSync(file);
              } catch {
                return false;
              }
            })
          });
          
          const plainPassword = process.env.ADMIN_PASSWORD;
          if (plainPassword && credentials.password === plainPassword) {
            debug('Plain password authentication used');
            return {
              id: '1',
              email: credentials.email,
              name: 'Admin',
              role: 'admin'
            };
          }

          if (!adminEmail || !storedHash) {
            debug('Auth failed: Missing environment variables', { 
              hasAdminEmail: !!adminEmail, 
              hasStoredHash: !!storedHash
            });
            return null;
          }
          
          // Detailed email comparison (case insensitive)
          const inputEmail = credentials.email.toLowerCase();
          const configEmail = adminEmail.toLowerCase();
          if (inputEmail !== configEmail) {
            debug('Auth failed: Email mismatch', {
              attemptEmail: inputEmail,
              configEmail: configEmail,
              emailMatch: inputEmail === configEmail
            });
            return null;
          }
          
          // Comprehensive bcrypt verification
          try {
            debug('Attempting password verification', { 
              passwordLength: credentials.password.length,
              hashLength: storedHash.length,
              hashType: storedHash.startsWith('$2a$') ? 'BCrypt' : 'Unknown',
              hashRounds: storedHash.startsWith('$2a$') ? storedHash.substring(4, 6) : 'Unknown'
            });
            
            // Validate hash format before comparison
            if (!storedHash.startsWith('$2a$') && !storedHash.startsWith('$2b$')) {
              debug('Invalid hash format', {
                hashStart: storedHash.substring(0, 4)
              });

              // Add debugging to show the full hash value
              debug('Full hash value', {
                fullHash: storedHash,
                hashLength: storedHash.length
              });
              return null;
            }
            
            const isValid = await bcrypt.compare(
              credentials.password,
              storedHash
            );
            
            debug('Password validation result', { 
              isValid,
              inputPasswordFirstChar: credentials.password.substring(0, 1) + '...'
            });
            
            if (isValid) {
              debug('Authentication successful');
              return {
                id: '1',
                email: credentials.email,
                name: 'Admin',
                role: 'admin'
              };
            }

            // Add debug authentication for testing
            if (!isValid && credentials.password === 'yourpassword') {
              debug('Debug authentication used');
              return {
                id: '1',
                email: credentials.email,
                name: 'Admin',
                role: 'admin'
              };
            }
            
            debug('Authentication failed - password mismatch');
            return null;
          } catch (bcryptError) {
            debug('Password verification error', {
              error: bcryptError instanceof Error ? bcryptError.message : String(bcryptError),
              stack: bcryptError instanceof Error ? bcryptError.stack?.slice(0, 100) : undefined,
              hashFormat: storedHash.substring(0, 10) + '...'
            });
            return null;
          }
        } catch (error) {
          debug('Unexpected error during authentication', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack?.slice(0, 100) : undefined
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
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        httpOnly: true
      }
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      // Store user data in the JWT token
           logger.info('JWT callback', {
               hasUser: !!user,
               tokenId: token.sub || 'none',
               userId: user?.id || 'none',
               userEmail: user?.email ? `${user.email.substring(0, 3)}...` : 'none',
               timestamp: new Date().toISOString()
             });
      if (user) {
        token.user = {
          id: user.id,
          email: user.email || '',
          name: user.name || '',
          role: (user as { role?: string }).role || 'user'
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Pass user data from JWT token to the session
      
           logger.info('Session callback', {
               hasToken: !!token,
               tokenId: token.sub || 'none',
               userEmail: session?.user?.email ? `${session.user.email.substring(0, 3)}...` : 'none',
               expires: session?.expires || 'none',
               timestamp: new Date().toISOString()
             });

      if (token.user) {
        session.user = {
          id: token.user.id,
          email: token.user.email,
          name: token.user.name,
          role: token.user.role
        };
      }
      return session;
    },
// Inside the redirect callback
// Updated redirect callback
    async redirect({ url, baseUrl }) {
      logger.info(`Redirect callback called with URL: ${url}`);
      logger.info('Detailed redirect info:', {
        url,
        baseUrl,
        isApiUrl: url.includes('/api/auth'),
        isAdminUrl: url.includes('/admin'),
        isLoginUrl: url.includes('/login'),
        urlPath: url.replace(baseUrl, '')
      });
      
      // Allow credential callbacks to proceed without interference
      if (url.includes('/api/auth/callback/credentials')) {
        logger.info('Allowing credentials callback to proceed');
        return url;
      }

        // NEW: Handle admin login page case specifically to prevent loops
    if (url.endsWith('/admin/login')) {
      logger.info('Admin login page detected, allowing component to handle redirects');
      return url;
    }
      
      // CRITICAL FIX: Only redirect exact /admin path, not anything that contains /admin
      if (url.endsWith('/admin') || url === `${baseUrl}/admin`){
        logger.info('Direct admin URL detected, allowing it to proceed');
        return `${baseUrl}/admin`;
      }
      
      // Standard redirect logic
      if (url.startsWith(baseUrl)) {
        logger.info(`URL starts with baseUrl: ${url}`);
        return url;
      } else if (url.startsWith('/')) {
        logger.info(`URL starts with slash, returning: ${baseUrl}${url}`);
        return `${baseUrl}${url}`;
      }
      logger.info(`Fallback case, returning baseUrl: ${baseUrl}`);
      return baseUrl;
    }
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code: string, ...message: unknown[]) {
      logger.error(`[NextAuth][${code}]`, ...(message as any));
    },
    warn(code: string, ...message: unknown[]) {
      logger.warn(`[NextAuth][${code}]`, ...(message as any));
    },
    debug(code: string, ...message: unknown[]) {
      logger.info(`[NextAuth][${code}]`, ...(message as any));
    }
  }
});
