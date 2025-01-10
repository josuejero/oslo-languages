// src/lib/auth/config.ts
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// In a real application, this would be in a database
const ADMIN_USER = {
  id: '1',
  email: process.env.ADMIN_EMAIL,
  // This should be a hashed password in production
  hashedPassword: process.env.ADMIN_PASSWORD ? 
    bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10) : '',
};

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password');
        }

        // Check if it's the admin user
        if (credentials.email !== ADMIN_USER.email) {
          throw new Error('Invalid email or password');
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password,
          ADMIN_USER.hashedPassword
        );

        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: ADMIN_USER.id,
          email: ADMIN_USER.email,
          role: 'admin'
        };
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};