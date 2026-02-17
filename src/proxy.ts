import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { protectedRoutes, publicRoutes } from "./data/routes";

type UserRole = "parent" | "nanny" | "vendor" | "admin" | "moderator" | undefined;

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    console.log("token", token);

    const isAuthenticated = !!token?.accessToken;
    const userRole = (token?.role as UserRole) || undefined;
    const isAdmin = userRole === "admin";
    const isModerator = userRole === "moderator";

    // Helper function to check if pathname matches any protected route
    const isProtectedRoute = (path: string): boolean => {
        const cleanPath = path.split("?")[0]; // Remove query params
        return Object.values(protectedRoutes).some((route: string) => {
            // Exact match
            if (cleanPath === route) return true;
            // Check if path starts with the route (for nested routes like /courses/123)
            if (cleanPath.startsWith(route + "/")) return true;
            return false;
        });
    };

    // Sensitive routes that moderators must not access
    const isModeratorBlockedRoute = (path: string): boolean => {
        const cleanPath = path.split("?")[0];
        const blockedRoutes = ["/users", "/team"];
        return blockedRoutes.some((route) => {
            if (cleanPath === route) return true;
            if (cleanPath.startsWith(route + "/")) return true;
            return false;
        });
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

    // Special case: moderators are blocked from sensitive routes and sent to home
    if (isModerator && isModeratorBlockedRoute(pathname)) {
        return NextResponse.redirect(new URL(protectedRoutes.dashboard, request.url));
    }

    // Check if accessing a protected route
    if (isProtectedRoute(pathname)) {
        // Only admins and moderators can access protected routes (except the sensitive ones above)
        if (!isAdmin && !isModerator) {
            return NextResponse.redirect(new URL(publicRoutes.auth.login, request.url));
        }
    }

    // If authenticated admin tries to access auth routes, redirect to dashboard
    if (isAuthRoute && isAdmin) {
        return NextResponse.redirect(new URL(protectedRoutes.dashboard, request.url));
    }

    // Allow access
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|authimage.jpg).*)"],
};