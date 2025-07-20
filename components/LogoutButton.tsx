// components/LogoutButton.tsx
"use client";

import { removeCookie } from '@/utils/cookieUtil';
import { sweetToast } from '@/utils/sweetAlert';
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // 실제 로그아웃 로직 처리 후, 로그인 페이지로 이동 등
    sweetToast("로그아웃 되었습니다.");
    removeCookie("member");
    router.push("/login");
  };

  return (
    <button
      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
      onClick={handleLogout}
    >
      로그아웃
    </button>
  );
}
