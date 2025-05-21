import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  
  if (!token && !request.nextUrl.pathname.startsWith("/auth")) return redirectTo(request, "/auth");
  if (token && request.nextUrl.pathname.startsWith("/auth")) return redirectTo(request, "/dashboard");

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
  ],
}