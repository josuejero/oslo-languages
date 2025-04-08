// src/app/api/debug-auth/route.ts
import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";

export async function GET() {
  const headersList = headers();
  const cookieStore = cookies();
  
  return NextResponse.json({
    pathname: headersList.get("x-pathname") || "unknown",
    cookies: {
      // List all cookies (be careful with this in production)
      all: cookieStore.getAll().map(c => c.name),
      // Check for specific auth cookies
      nextAuthSession: cookieStore.has("next-auth.session-token"),
      adminAuth: cookieStore.has("admin_authenticated"),
    },
    headers: {
      referer: headersList.get("referer"),
      userAgent: headersList.get("user-agent"),
    }
  });
}