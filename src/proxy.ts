import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { protectedRoutes, publicRoutes } from "./data/routes";

type UserRole = "parent" | "nanny" | "vendor" | "guest" | "admin" | undefined;

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    console.log("token", token);

    const isAuthenticated = !!token?.accessToken;
    const isEmailVerified = !!token?.emailVerified;
    const userRole = (token?.role as UserRole) || undefined;
    const isAdmin = userRole === "admin";

    // Helper function to check if pathname matches any route in an object
    // biome-ignore lint/suspicious/noExplicitAny: <explanation-reason-here>
    const matchesRoute = (path: string, routes: string | Record<string, any>): boolean => {
        if (typeof routes === "string") {
            // Handle dynamic routes (with :id) - check if path starts with the base route
            const baseRoute = routes.split(":")[0];
            // Remove trailing slash for comparison
            const cleanBaseRoute = baseRoute.replace(/\/$/, "");
            const cleanPath = path.split("?")[0]; // Remove query params
            return cleanPath === cleanBaseRoute || cleanPath.startsWith(`${cleanBaseRoute}/`);
        }
        // Recursively check nested objects
        return Object.values(routes).some((route) => matchesRoute(path, route));
    };

    // Check if current route is an auth route
    const isAuthRoute = Object.values(publicRoutes.auth).some((route: string) =>
        pathname.startsWith(route)
    );

    // If user is NOT authenticated
    if (!isAuthenticated) {
        // Allow auth routes (like /signin) for unauthenticated users
        if (isAuthRoute) {
            return NextResponse.next();
        }
        // Redirect all other routes to login
        return NextResponse.redirect(new URL(publicRoutes.auth.login, request.url));
    }

    // User IS authenticated from here onwards

    // Check if user is admin (email verification not required for admin)
    if (!isAdmin) {
        // Not admin - redirect to login
        return NextResponse.redirect(new URL(publicRoutes.auth.login, request.url));
    }

    // If authenticated admin tries to access auth routes, redirect to dashboard
    if (isAuthRoute) {
        return NextResponse.redirect(new URL(protectedRoutes.dashboard, request.url));
    }

    // Allow authenticated, verified admin to access all other routes
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};