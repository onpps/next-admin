'use client';

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function ConditionalSidebar() {
  const pathname = usePathname();

  const isLoginPage = pathname.startsWith("/login");
  const isAgreePage = pathname.startsWith("/agree");
  const isRegisterPage = pathname.startsWith("/register");
  const isFindIdPage = pathname.startsWith("/findId");
  const isFindPasswordPage = pathname.startsWith("/findPassword");
  const isPlayerPage = pathname.startsWith("/youtubeplayer");

  console.log("isLoginPage=>" + isLoginPage);
  console.log("isPlayerPage=>" + isPlayerPage);

  return !isLoginPage && !isAgreePage && !isRegisterPage && !isFindIdPage && !isFindPasswordPage && !isPlayerPage ? <Sidebar /> : null;
}
