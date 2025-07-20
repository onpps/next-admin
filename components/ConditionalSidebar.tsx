'use client';

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function ConditionalSidebar() {
  const pathname = usePathname();
  const isLoginPage = pathname.startsWith("/login");

  console.log("isLoginPage=>" + isLoginPage);

  return !isLoginPage ? <Sidebar /> : null;
}
