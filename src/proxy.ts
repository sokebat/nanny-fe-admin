import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { protectedRoutes, publicRoutes } from "./data/routes";

type UserRole = "parent" | "nanny" | "vendor" | "guest" | undefined;

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("token", token);

  const isAuthenticated = !!token?.accessToken;
  const isEmailVerified = token?.emailVerified;
  const userRole = (token?.role as UserRole) || undefined;

  // Helper function to check if pathname matches any route in an object
  // biome-ignore lint/suspicious/noExplicitAny: <explanation-reason-here>
  const matchesRoute = (
    path: string,
    routes: string | Record<string, any>
  ): boolean => {
    if (typeof routes === "string") {
      // Handle dynamic routes (with :id) - check if path starts with the base route
      const baseRoute = routes.split(":")[0];
      // Remove trailing slash for comparison
      const cleanBaseRoute = baseRoute.replace(/\/$/, "");
      const cleanPath = path.split("?")[0]; // Remove query params
      return (
        cleanPath === cleanBaseRoute ||
        cleanPath.startsWith(`${cleanBaseRoute}/`)
      );
    }
    // Recursively check nested objects
    return Object.values(routes).some((route) => matchesRoute(path, route));
  };

  // Check route types
  const isAuthRoute = Object.values(publicRoutes.auth).some(
    (route) => typeof route === "string" && pathname.startsWith(route)
  );

  // Profile route is shared by all roles
  const isProfileRoute =
    pathname === "/profile" || pathname.startsWith("/profile/");

  const isProtectedRoute =
    pathname === protectedRoutes.dashboard || isProfileRoute;

  // Allow root path and public page routes for everyone
  if (pathname === "/") {
    return NextResponse.next();
  }

  // If user is NOT authenticated
  if (!isAuthenticated) {
    // Allow auth routes for unauthenticated users
    if (isAuthRoute) {
      return NextResponse.next();
    }
    // Redirect all other routes to login
    return NextResponse.redirect(new URL(publicRoutes.auth.login, request.url));
  }

  // User IS authenticated from here onwards

  // If authenticated user tries to access auth routes, redirect to their dashboard
  if (isAuthRoute) {
    // Redirect based on role

    // Default to profile if role is unknown
    return NextResponse.redirect(
      new URL(protectedRoutes.dashboard, request.url)
    );
  }

  // Role-based route access control
  if (isProtectedRoute) {
    // Profile route is accessible by all authenticated roles
    if (isProfileRoute) {
      return NextResponse.next();
    }
  }

  // Default: allow the request
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
