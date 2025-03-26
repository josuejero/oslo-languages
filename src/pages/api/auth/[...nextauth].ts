// src/pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Enhanced debugging for auth process
const debug = (message, data = {}) => {
  console.log(`[NextAuth Debug] ${message}`, data);
  
  // You can enable file logging here if needed
  // logToFile(message, data);
};

// Validate environment variables on startup
const validateEnv = () => {
  const requiredVars = ['NEXTAUTH_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD_HASH'];
  const missing = requiredVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`[NextAuth] Missing required environment variables: ${missing.join(', ')}`);
    return false;
  }
  
  // Validate hash format (bcrypt hashes start with $2a$, $2b$, or $2y$)
  const hash = process.env.ADMIN_PASSWORD_HASH || '';
  const validHashPattern = /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/;
  
  if (!validHashPattern.test(hash)) {
    console.error('[NextAuth] Admin password hash format appears invalid');
    return false;
  }
  
  return true;
};

// Log environment status (sanitized)
debug('Initializing with admin credentials', {
  adminEmailExists: !!process.env.ADMIN_EMAIL,
  adminPasswordHashExists: !!process.env.ADMIN_PASSWORD_HASH,
  adminPasswordHashFormat: process.env.ADMIN_PASSWORD_HASH?.substring(0, 7) + '...',
  hashLength: process.env.ADMIN_PASSWORD_HASH?.length,
  environmentValid: validateEnv(),
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
          // Enhanced request logging
          debug('Auth request received', {
            hasCredentials: !!credentials,
            emailProvided: !!credentials?.email,
            passwordProvided: !!credentials?.password,
          });

          // Validate credentials
          if (!credentials?.email || !credentials?.password) {
            debug('Auth failed: Missing credentials');
            return null;
          }
          
          // Get environment variables with validation
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
          
          // Verify password with additional error handling
          try {
            const isValid = await bcrypt.compare(
              credentials.password,
              storedHash
            );
            
            debug('Password validation completed', {
              isValid,
              providedPasswordLength: credentials.password.length,
              storedHashLength: storedHash.length,
            });
            
            // Return user if authentication succeeds
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
            // Handle bcrypt-specific errors
            debug('Password verification error', {
              errorMessage: bcryptError instanceof Error ? bcryptError.message : String(bcryptError),
              errorType: bcryptError.constructor.name,
              storedHashPrefix: storedHash.substring(0, 7)
            });
            return null;
          }
        } catch (error) {
          debug('Unexpected error during authentication', {
            errorType: error.constructor.name,
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
  pages: {
    signIn: '/admin/login',
    error: '/admin/login', // Redirect back to login page with error
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user data to token if available
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user data from token to session
      session.user = token.user;
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, ...message) {
      debug(`Error: ${code}`, { message });
    },
    warn(code, ...message) {
      debug(`Warning: ${code}`, { message });
    },
    debug(code, ...message) {
      debug(`Debug: ${code}`, { message });
    }
  }
});