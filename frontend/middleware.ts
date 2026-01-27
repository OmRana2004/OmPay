import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🔹 Direct access control NOT here
  // 🔹 Backend APIs handle real auth

  // Optional: prevent accessing root
//   if (pathname === "/") {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/transfer/:path*",
    "/transactions/:path*",
    "/signin",
    "/signup",
  ],
};
