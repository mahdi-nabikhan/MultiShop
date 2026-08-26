import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
    "/customer-panel",
    "/shop-admin-panel",
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtectedRoute = protectedRoutes.some(
        (route) =>
            pathname === route ||
            pathname.startsWith(`${route}/`)
    );

    if (!isProtectedRoute) {
        return NextResponse.next();
    }

    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
        const loginUrl = new URL("/login", request.url);

        loginUrl.searchParams.set("next", pathname);

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/customer-panel/:path*",
        "/shop-admin-panel/:path*",
    ],
};