// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;
  
  // Skip middleware for login-related paths
  if (pathname === "/admin/login" || 
      pathname.startsWith("/api/auth") || 
      pathname.includes("_next")) {
    return NextResponse.next();
  }

  // Check authentication for admin routes
  if (pathname.startsWith("/admin")) {
    const authCookie = request.cookies.get("next-auth.session-token") || 
                      request.cookies.get("__Secure-next-auth.session-token");
    
    // Redirect to login if not authenticated
    if (!authCookie) {
      const url = new URL("/admin/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};