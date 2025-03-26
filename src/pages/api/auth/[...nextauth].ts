// src/pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

interface NextAuthUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Debug function for auth-related logs
const debug = (message: unknown, data = {}) => {
  console.log(`[NextAuth Debug] ${message}`, data);
};

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
          // Check for credentials
          if (!credentials?.email || !credentials?.password) {
            debug('Auth failed: Missing credentials');
            return null;
          }
          
          // Get environment variables
          const adminEmail = process.env.ADMIN_EMAIL;
          const storedHash = process.env.ADMIN_PASSWORD_HASH;
          
          if (!adminEmail || !storedHash) {
            debug('Auth failed: Missing environment variables');
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
              errorMessage: bcryptError instanceof Error ? bcryptError.message : String(bcryptError)
            });
            return null;
          }
        } catch (error) {
          debug('Unexpected error during authentication', {
            errorMessage: error instanceof Error ? error.message : String(error)
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
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      // Cast token.user to NextAuthUser or undefined to satisfy TypeScript
      session.user = token.user as NextAuthUser | undefined;
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development',
});
