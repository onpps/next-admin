'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';
import { getCookie } from '@/utils/cookieUtil';

interface MemberInfo {
  roleNames: string;
}

export default function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(false);

  const rawCookie = getCookie("member");

  //let isAdmin = false;

  useEffect(() => {

    try {
      let memberInfo: MemberInfo | undefined;

      console.log("typeof rawCookie=>" + typeof rawCookie);

      if (typeof rawCookie === 'string') {
        memberInfo = JSON.parse(rawCookie);
      } else if (typeof rawCookie === 'object' && rawCookie !== null) {
        // 이미 객체인 경우 그대로 사용
        memberInfo = rawCookie ;
      }

      let roleNames = memberInfo?.roleNames;

      // isAdmin은 roleNames가 배열일 때만 검사
      const isAdmin = Array.isArray(roleNames) && roleNames.includes("ADMIN");

      if(isAdmin){
        setIsAdmin(true);
      }
      
      console.log("roleNames =>", roleNames);
      console.log("isAdmin =>", isAdmin);
    } catch (err) {
      console.error("memberInfo 파싱 오류:", err);
    }

  }, []);

  return (
    <aside className="w-48 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">관리자</h2>
      <ul className="space-y-4">
        <li><Link href="/" className="hover:underline">대시보드</Link></li>
        {isAdmin && <li><Link href="/users" className="hover:underline">사용자 관리</Link></li>}
        <li><Link href="/member" className="hover:underline">계정 관리</Link></li>
        <li><Link href="/musics" className="hover:underline">음악 관리</Link></li>
        <li><Link href="/playList" className="hover:underline">플레이 리스트</Link></li>
        <li><Link href="/payment" className="hover:underline">결제 관리</Link></li>
        <li><Link href="/config" className="hover:underline">환경 설정</Link></li>
      </ul>
    </aside>
  );
}
