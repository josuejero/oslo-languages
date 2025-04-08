// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Completely skip any middleware processing for admin login page
  if (request.nextUrl.pathname === "/admin/login") {
    console.log("Login page detected in middleware - bypassing ALL logic");
    return NextResponse.next();
  }

  // For now, allow all other admin routes without auth check
  // We'll implement proper auth later once the redirect loop is fixed
  console.log(`Admin route: ${request.nextUrl.pathname} - allowing access temporarily`);
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};