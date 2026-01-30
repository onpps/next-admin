'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCookie } from '@/utils/cookieUtil';

interface MemberInfo {
  roleNames: string[];
}

export default function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname(); // ⭐ 현재 경로

  const rawCookie = getCookie("member");

  useEffect(() => {
    try {
      let memberInfo: MemberInfo | undefined;

      if (typeof rawCookie === 'string') {
        memberInfo = JSON.parse(rawCookie);
      } else if (typeof rawCookie === 'object' && rawCookie !== null) {
        memberInfo = rawCookie;
      }

      const roleNames = memberInfo?.roleNames;
      setIsAdmin(Array.isArray(roleNames) && roleNames.includes("ADMIN"));
    } catch (err) {
      console.error("memberInfo 파싱 오류:", err);
    }
  }, [rawCookie]);

  // ⭐ 메뉴 공통 스타일 함수
  const menuClass = (href: string) =>
    `block px-3 py-2 rounded transition
     ${pathname === href
       ? 'bg-gray-700 text-white font-semibold'
       : 'text-gray-300 hover:bg-gray-700 hover:text-white'
     }`;

  return (
    <aside className="w-48 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">관리자</h2>
      <ul className="space-y-2">
        <li><Link href="/" className={menuClass('/')}>대시보드</Link></li>

        {isAdmin && (
          <li>
            <Link href="/users" className={menuClass('/users')}>
              사용자 관리
            </Link>
          </li>
        )}

        <li><Link href="/member" className={menuClass('/member')}>계정 관리</Link></li>
        <li><Link href="/musics" className={menuClass('/musics')}>음악 관리</Link></li>
        <li><Link href="/playList" className={menuClass('/playList')}>플레이 리스트</Link></li>
        <li><Link href="/payment" className={menuClass('/payment')}>결제 관리</Link></li>
        <li><Link href="/history" className={menuClass('/history')}>로그인 이력 관리</Link></li>
        <li><Link href="/config" className={menuClass('/config')}>환경 설정</Link></li>
      </ul>
    </aside>
  );
}
