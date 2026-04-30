"use client";

import ConditionalSidebar from "@/components/ConditionalSidebar";
import LogoutButton from "@/components/LogoutButton";
import { usePathname } from "next/navigation";
import { AppProviders } from './providers';
import "./globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isPlayerPage = pathname.startsWith("/player");

  // LogoutButton 숨길 경로들
  const hideLogoutPaths = ["/agree", "/register", "/findId", "/findPassword"];
  const hideLogout = hideLogoutPaths.includes(pathname);

  console.log("pathname=>" + pathname);

  // 플레이어 페이지는 완전 빈 레이아웃
  if (isPlayerPage) {
    return (
      <html lang="ko">
        <body className="w-full h-screen bg-black overflow-hidden">
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="ko">
      <body className="flex w-full h-screen overflow-hidden">
        <AppProviders>
          <ConditionalSidebar />
          <main className="flex-1 h-screen overflow-y-auto p-6 bg-gray-900">
            
            {/* 조건부 렌더링 */}
            {!hideLogout && (
              <div className="absolute top-4 right-6 z-50">
                <LogoutButton />
              </div>
            )}

            {children}
          </main>
        </AppProviders>
      </body>
    </html>
  );
}