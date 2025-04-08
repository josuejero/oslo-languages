// src/types/next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      isAdmin?: boolean | unknown;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    isAdmin?: boolean;
  }

  interface JWT {
    isAdmin?: boolean;
  }
}
