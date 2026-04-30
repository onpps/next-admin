"use client";

import { useState } from "react";
import { sweetToast } from "@/utils/sweetAlert";
import { dofindId } from "@/api/LoginApi";
import Link from "next/link";

const initState = {
  name: "",
  phoneNumber: "",
};

export default function FindIdPage() {
  const [findParam, setFindParam] = useState(initState);
  // 찾은 아이디 목록을 저장할 상태 추가
  const [foundIds, setFoundIds] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFindParam((prev) => ({ ...prev, [name]: value }));
  };

  const handleFindId = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!findParam.name) {
      sweetToast("이름을 입력하세요.");
      return;
    }
    if (!findParam.phoneNumber) {
      sweetToast("전화번호를 입력하세요.");
      return;
    }

    try {
      const data = await dofindId(findParam);
      console.log("data=>" + JSON.stringify(data));

      if (data.result === 'notFound' || !data.result || data.result.length === 0) {
        sweetToast("아이디를 찾을 수 없습니다.");
        setFoundIds([]);
        return;
      }

      // 결과 배열 저장
      setFoundIds(data.result);
      //sweetToast("아이디를 성공적으로 찾았습니다.");
    } catch (error) {
      console.log(error);
      sweetToast("정보 확인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">아이디 찾기</h2>
        
        {/* 결과가 없을 때: 입력 폼 표시 */}
        {foundIds.length === 0 ? (
          <>
            <p className="text-gray-400 text-sm mb-6 text-center">
              가입 시 등록한 이름과 휴대폰 번호를 입력해주세요.
            </p>
            <form onSubmit={handleFindId} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="이름"
                value={findParam.name}
                onChange={handleChange}
                className="p-3 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="휴대폰 번호 (- 제외)"
                value={findParam.phoneNumber}
                onChange={handleChange}
                className="p-3 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition duration-300 mt-2"
              >
                아이디 찾기
              </button>
            </form>
          </>
        ) : (
          /* 결과가 있을 때: 아이디 목록 표시 */
          <div className="flex flex-col gap-4">
            <p className="text-gray-300 text-sm text-center mb-2">
              입력하신 정보와 일치하는 아이디입니다.
            </p>
            <div className="bg-gray-700 rounded-xl p-4 flex flex-col gap-2 border border-gray-600">
              {foundIds.map((id, index) => (
                <div key={index} className="text-white font-mono text-center py-2 bg-gray-800 rounded border border-gray-700">
                  {id}
                </div>
              ))}
            </div>
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition duration-300 mt-2 text-center"
            >
              로그인하러 가기
            </Link>
            <button
              onClick={() => setFoundIds([])}
              className="text-gray-400 text-xs hover:text-white underline transition"
            >
              다시 찾기
            </button>
          </div>
        )}

        <div className="flex justify-end items-center mt-6 text-sm text-gray-400 gap-3">
          <Link href="/login" className="hover:text-white transition">
            로그인
          </Link>
          <span className="text-gray-600 text-xs">|</span>
          <Link href="/findPassword" className="hover:text-white transition">
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}
