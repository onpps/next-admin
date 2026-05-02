"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { sweetToast } from "@/utils/sweetAlert";
import { doLogin } from "@/api/LoginApi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { loginSuccess } from "../store/authSlice";
import Link from "next/link"; // Link 컴포넌트 추가

const initState = {
  id: "",
  password: "",
};

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [loginParam, setLoginParam] = useState(initState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginParam((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginParam.id || !loginParam.password) {
      sweetToast("아이디와 비밀번호를 모두 입력하세요.");
      return;
    }

    try {
      const data = await doLogin(loginParam);

      console.log("data=>" + JSON.stringify(data));

      if (data.error) {
        sweetToast("로그인 정보가 올바르지 않습니다.");
        return;
      }

      if (data.error) {
        sweetToast(data.message || "로그인 정보가 올바르지 않습니다.");
        return;
      }

      const roleNames = data.roleNames || [];
      if (roleNames.length === 1 && roleNames[0] === "USER") {
        sweetToast("로그인 권한이 없습니다.");
        return;
      }

      dispatch(loginSuccess(data));
      sweetToast("로그인 성공");
      router.push("/");

    } catch (error: unknown) {
      console.log(error);

      let serverMsg = "";

      if (error instanceof AxiosError) {
        serverMsg = error.response?.data?.message || error.response?.data || "";
      }

      if (serverMsg.includes("자격 증명에 실패")) {
        sweetToast("로그인 정보가 올바르지 않습니다.");
      } else {
        sweetToast(serverMsg || "로그인 중 오류가 발생했습니다.");
      }
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">관리자 로그인</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            name="id"
            placeholder="아이디"
            value={loginParam.id}
            onChange={handleChange}
            className="p-3 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={loginParam.password}
            onChange={handleChange}
            className="p-3 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition duration-300"
          >
            로그인
          </button>
        </form>

        {/* 아이디 찾기 및 비밀번호 변경 영역 (우측 정렬) */}
        <div className="flex justify-end items-center mt-6 text-sm text-gray-400 gap-3">
          <Link href="/agree" className="hover:text-white transition">
            회원가입
          </Link>
          <span className="text-gray-600 text-xs">|</span>
          <Link href="/findId" className="hover:text-white transition">
            아이디 찾기
          </Link>
          <span className="text-gray-600 text-xs">|</span>
          <Link href="/findPassword" className="hover:text-white transition">
            비밀번호 변경하기
          </Link>
        </div>
      </div>
    </div>
  );
}