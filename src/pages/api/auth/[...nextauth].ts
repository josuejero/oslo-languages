// src/pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Debug function for auth-related logs
const debug = (message: string, data: Record<string, unknown> = {}) => {
  console.log(`[NextAuth Debug] ${message}`, data);
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
          // Check for credentials
          if (!credentials?.email || !credentials?.password) {
            debug('Auth failed: Missing credentials');
            return null;
          }
          
          // Get environment variables - add better error handling
          const adminEmail = process.env.ADMIN_EMAIL;
          const storedHash = process.env.ADMIN_PASSWORD_HASH;
          
          if (!adminEmail || !storedHash) {
            debug('Auth failed: Missing environment variables', { 
              hasAdminEmail: !!adminEmail, 
              hasStoredHash: !!storedHash 
            });
            return null;
          }
          
          // Compare email (case insensitive)
          if (credentials.email.toLowerCase() !== adminEmail.toLowerCase()) {
            debug('Auth failed: Email mismatch');
            return null;
          }
          
          // Verify password
          try {
            const isValid = await bcrypt.compare(
              credentials.password,
              storedHash
            );
            
            debug('Password validation:', { isValid });
            
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
              error: bcryptError instanceof Error ? bcryptError.message : String(bcryptError)
            });
            return null;
          }
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
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Safe assignment with user containing the required fields
        token.user = {
          id: user.id,
          email: user.email || '',
          name: user.name || '',
          role: (user as any).role || 'user' // Default to 'user' if role is missing
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Add user to session with proper typing
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
    // Add redirect callback to prevent loops
    async redirect({ url, baseUrl }) {
      // If the URL starts with the base URL, allow it
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // For relative URLs, prepend the base URL
      else if (url.startsWith('/')) {
        return new URL(url, baseUrl).toString();
      }
      // Default fallback to the base URL
      return baseUrl;
    }
  },
  debug: process.env.NODE_ENV === 'development',
});