"use client";

import ConditionalSidebar from "@/components/ConditionalSidebar";
import LogoutButton from "@/components/LogoutButton";
import { usePathname } from "next/navigation";
import { AppProviders } from './providers';
import "./globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isVideoPage = pathname.startsWith("/video");

  console.log("pathname=>" + pathname);
  console.log("isVideoPage=>" + isVideoPage);

  //if (isVideoPage) {
    // video 페이지는 layout 없이 children만 렌더
   // return <>{children}</>;
  //}

  return (
    <html lang="ko">
      <body className="flex w-full h-screen overflow-hidden">
        <AppProviders>
          <ConditionalSidebar />
            <main className="flex-1 h-screen overflow-y-auto p-6 bg-gray-900">
              <div className="absolute top-4 right-6 z-50">
                <LogoutButton />
              </div>
              {children}
            </main>
        </AppProviders>
      </body>
    </html>
  );
}
