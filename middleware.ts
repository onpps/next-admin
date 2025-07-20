import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const cookie = request.cookies.get("member");
    const pathname = request.nextUrl.pathname;

    // 로그인 페이지는 예외 처리
    if (pathname.startsWith("/login")) {
        return NextResponse.next();
    }

    console.log("cookie=>" + cookie);

    // 로그인 쿠키가 없으면 /login 으로 리다이렉트
    if (!cookie) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

// middleware가 적용될 경로 설정
export const config = {
  matcher: [
    "/dashboard/:path*",   // 보호할 경로 예시
    "/admin/:path*",
    "/settings/:path*",
    "/"                    // 홈도 보호하려면 추가
  ],
};
