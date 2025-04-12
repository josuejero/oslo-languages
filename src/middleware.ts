
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  
  const { pathname } = request.nextUrl;
  
  
  if (pathname === "/admin/login" || 
      pathname.startsWith("/api/auth") || 
      pathname.includes("_next")) {
    return NextResponse.next();
  }

  
  if (pathname.startsWith("/admin")) {
    const authCookie = request.cookies.get("next-auth.session-token") || 
                      request.cookies.get("__Secure-next-auth.session-token");
    
    
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