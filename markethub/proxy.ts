import { auth } from "@/auth"
import { NextResponse } from "next/server"

// Define protected routes
const protectedRoutes = ["/checkout", "/account", "/orders", "/profile"]
const authRoutes = ["/login", "/register"]

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
    return
  }

  if (isProtectedRoute && !isLoggedIn) {
    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) {
      callbackUrl += nextUrl.search
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    )
  }

  return
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
