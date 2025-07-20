// components/Sidebar.tsx
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-48 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">관리자</h2>
      <ul className="space-y-4">
        <li><Link href="/" className="hover:underline">대시보드</Link></li>
        <li><Link href="/users" className="hover:underline">사용자 관리</Link></li>
        <li><Link href="/member" className="hover:underline">계정 관리</Link></li>
        <li><Link href="/musics" className="hover:underline">음악 관리</Link></li>
        <li><Link href="/playList" className="hover:underline">플레이 리스트</Link></li>
        <li><Link href="/blockList" className="hover:underline">차단 리스트</Link></li>
        <li><Link href="/payment" className="hover:underline">결제 관리</Link></li>
        <li><Link href="/config" className="hover:underline">환경 설정</Link></li>
        <li><Link href="/video" className="hover:underline">비디오</Link></li>
      </ul>
    </aside>
  );
}
