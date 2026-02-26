'use client';

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function ConditionalSidebar() {
  const pathname = usePathname();

  const isLoginPage = pathname.startsWith("/login");
  const isPlayerPage = pathname.startsWith("/youtubeplayer");

  console.log("isLoginPage=>" + isLoginPage);
  console.log("isPlayerPage=>" + isPlayerPage);

  return !isLoginPage && !isPlayerPage ? <Sidebar /> : null;
}
