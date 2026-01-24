// components/LogoutButton.tsx
"use client";

import { useEffect, useState } from "react";
import { getCookie, removeCookie } from "@/utils/cookieUtil";
import { sweetToast } from "@/utils/sweetAlert";
import { usePathname, useRouter } from "next/navigation";

interface MemberInfo {
  id: string;
  storeId: string;
}

export default function LogoutButton() {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [member, setMember] = useState<MemberInfo | null>(null);

  // ✅ mount 이후에만 쿠키 접근
  useEffect(() => {
    setMounted(true);

    const cookieMember = getCookie("member") as MemberInfo | undefined;
    if (cookieMember) {
      setMember(cookieMember);
    }
  }, []);

  const handleLogout = () => {
    sweetToast("로그아웃 되었습니다.");
    removeCookie("member");
    router.push("/login");
  };

  // ✅ 모든 Hook 이후에 조건 분기
  if (!mounted) return null;
  if (pathname === "/login") return null;

  return (
    <div className="flex items-center gap-4">
      {/* 로그인 아이디 */}
      <span className="text-sm text-white font-medium flex items-center gap-1">
        👤 {member?.id}
      </span>

      {/* 로그아웃 버튼 */}
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
      >
        로그아웃
      </button>
    </div>
  );
}
