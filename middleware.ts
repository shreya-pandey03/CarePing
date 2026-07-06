export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    /*
     * Protect every dashboard route.
     */

    "/dashboard/:path*",
    "/habits/:path*",
    "/analytics/:path*",
    "/reports/:path*",
    "/recommendations/:path*",
    "/insights/:path*",
    "/goals/:path*",
    "/streaks/:path*",
    "/notifications/:path*",
    "/profile/:path*",
  ],
};