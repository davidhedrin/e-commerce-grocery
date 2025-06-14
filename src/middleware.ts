import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { RolesEnum } from "@prisma/client";

const adminMenu = [
  "/dashboard",
  "/product"
];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const pathname = request.nextUrl.pathname;
  
  if (!token && !pathname.startsWith("/auth")) return redirectTo(request, "/auth");
  if (token && pathname.startsWith("/auth")) return redirectTo(request, "/");

  const isAdminPath = adminMenu.some((menu) => pathname.startsWith(menu));
  if (isAdminPath && token?.role != RolesEnum.ADMIN) return redirectTo(request, "/"); 

  return NextResponse.next();
}

function redirectTo(request: NextRequest, url: string) {
  const loginUrl = new URL(url, request.nextUrl.origin);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/dashboard",
    "/product/:path*",
  ],
}