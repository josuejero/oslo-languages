// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Create the handler using the imported options
const handler = NextAuth(authOptions);

// Export route handlers
export { handler as GET, handler as POST };