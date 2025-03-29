import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Enhanced debug function for auth-related logs with more detail
const debug = (message: string, data: Record<string, unknown> = {}) => {
  console.log(`[NextAuth Debug] ${message}`, {
    ...data,
    timestamp: new Date().toISOString(),
    env: {
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nodeEnv: process.env.NODE_ENV
    }
  });
};

// Define our custom user interface
interface CustomUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Extend the built-in NextAuth types
declare module "next-auth" {
  interface User {
    role?: string;
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role?: string;
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

// More detailed credentials authorization function
async function authorizeCredentials(credentials: Record<string, any> | undefined) {
  try {
    // Check for credentials
    if (!credentials?.email || !credentials?.password) {
      debug('Auth failed: Missing credentials', { 
        hasEmail: !!credentials?.email, 
        hasPassword: !!credentials?.password 
      });
      return null;
    }
    
    // Log environment variables status in detail
    const adminEmail = process.env.ADMIN_EMAIL;
    const storedHash = process.env.ADMIN_PASSWORD_HASH;
    
    debug('Environment variables check', { 
      adminEmail: adminEmail ? `${adminEmail.substring(0, 3)}...` : undefined, 
      storedHashLength: storedHash?.length || 0,
      storedHashPresent: !!storedHash
    });
    
    if (!adminEmail || !storedHash) {
      debug('Auth failed: Missing environment variables', { 
        hasAdminEmail: !!adminEmail, 
        hasStoredHash: !!storedHash,
        adminEmailLength: adminEmail?.length || 0,
        storedHashLength: storedHash?.length || 0
      });
      return null;
    }
    
    // Compare email (case insensitive) with detailed logging
    if (credentials.email.toLowerCase() !== adminEmail.toLowerCase()) {
      debug('Auth failed: Email mismatch', {
        attemptEmail: credentials.email.toLowerCase(),
        configEmail: adminEmail.toLowerCase()
      });
      return null;
    }
    
    // Verify password with detailed error handling
    try {
      debug('Attempting password verification', { 
        passwordLength: credentials.password.length,
        hashLength: storedHash.length 
      });
      
      const isValid = await bcrypt.compare(
        credentials.password,
        storedHash
      );
      
      debug('Password validation result', { isValid });
      
      if (isValid) {
        debug('Authentication successful');
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
        hashFormat: storedHash.substring(0, 10) + '...'
      });
      return null;
    }
  } catch (error) {
    debug('Unexpected error during authentication', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return null;
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: authorizeCredentials
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email || '',
          name: user.name || '',
          role: (user as any).role || 'user'
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
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url;
      } else if (url.startsWith('/')) {
        return new URL(url, baseUrl).toString();
      }
      return baseUrl;
    }
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, ...message) {
      console.error('[next-auth][error]', code, ...message);
    },
    warn(code, ...message) {
      console.warn('[next-auth][warn]', code, ...message);
    },
    debug(code, ...message) {
      console.log('[next-auth][debug]', code, ...message);
    }
  }
});
