"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sweetToast } from "@/utils/sweetAlert";
import { doFindPassword } from "@/api/LoginApi"; // API 함수가 있다고 가정
import Link from "next/link";

const initState = {
  id: "",
  email: "",
};

export default function FindPasswordPage() {
  const router = useRouter();
  const [findParam, setFindParam] = useState(initState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFindParam((prev) => ({ ...prev, [name]: value }));
  };

  const handleFindPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!findParam.id) {
      sweetToast("아이디를 입력하세요.");
      return;
    }

    if (!findParam.email) {
      sweetToast("이메일 주소를 입력하세요.");
      return;
    }

    try {
      // 비밀번호 찾기 API 호출
      const data = await doFindPassword(findParam);
      
      if (data.result === 'notFound') {
        sweetToast("일치하는 사용자 정보를 찾을 수 없습니다.");
        return;
      }

      if (data.result === 'notMatch') {
        sweetToast("일치하는 이메일 정보를 찾을 수 없습니다.");
        return;
      }

      sweetToast("이메일로 임시 비밀번호(또는 재설정 링크)가 발송되었습니다.");
      router.push("/login");
    } catch (error) {
      console.log(error);
      sweetToast("정보 확인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">비밀번호 찾기</h2>
        
        <p className="text-gray-400 text-sm mb-6 text-center">
          가입하신 아이디와 이메일 주소를 입력해주세요.
        </p>

        <form onSubmit={handleFindPassword} className="flex flex-col gap-4">
          <input
            type="text"
            name="id"
            placeholder="아이디"
            value={findParam.id}
            onChange={handleChange}
            className="p-3 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
          />
          <input
            type="email"
            name="email"
            placeholder="이메일 주소"
            value={findParam.email}
            onChange={handleChange}
            className="p-3 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition duration-300 mt-2"
          >
            비밀번호 찾기
          </button>
        </form>

        {/* 하단 링크 영역 (우측 정렬) */}
        <div className="flex justify-end items-center mt-6 text-sm text-gray-400 gap-3">
          <Link href="/login" className="hover:text-white transition">
            로그인
          </Link>
          <span className="text-gray-600 text-xs">|</span>
          <Link href="/findId" className="hover:text-white transition">
            아이디 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}