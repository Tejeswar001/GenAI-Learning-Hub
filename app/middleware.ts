import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the user is authenticated for protected routes
  const authCookie = request.cookies.get("firebase-auth-token")
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth")
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/chatbot") ||
    request.nextUrl.pathname.startsWith("/video-generator") ||
    request.nextUrl.pathname.startsWith("/learning")

  // If trying to access auth routes while logged in, redirect to dashboard
  if (isAuthRoute && authCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If trying to access protected routes while not logged in, redirect to sign in
  if (isProtectedRoute && !authCookie) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below
export const config = {
  matcher: ["/dashboard/:path*", "/chatbot/:path*", "/video-generator/:path*", "/learning/:path*", "/auth/:path*"],
}

