"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sweetToast } from '@/utils/sweetAlert';
import { doLogin } from "@/api/LoginApi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { loginSuccess } from "../store/authSlice";

const initState = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [loginParam, setLoginParam] = useState(initState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginParam(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginParam.email || !loginParam.password) {
      sweetToast("이메일과 비밀번호를 모두 입력하세요.");
      return;
    }

    try {
      // 서버 연동 전 가짜 로그인 검증
      doLogin(loginParam).then(data => {
        console.log("data=>" + JSON.stringify(data));
        if(data.error) {
          sweetToast("로그인 정보가 올바르지 않습니다.");
        }else{
          dispatch(loginSuccess(data));

          //localStorage.setItem("data", data);

          sweetToast("로그인 성공");
          router.push("/");
        }
      });
    } catch (error) {
      console.log("error=>" + JSON.stringify(error));
      sweetToast("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">관리자 로그인</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 p-6 bg-gray-800 rounded-2xl">
          <input
            type="text"
            name="email"
            value={loginParam.email}
            onChange={handleChange}
            placeholder="이메일"
            className="p-2 rounded bg-gray-100"
          />
          <input
            type="password"
            name="password"
            value={loginParam.password}
            onChange={handleChange}
            placeholder="비밀번호"
            className="p-2 rounded bg-gray-100"
          />
          <button type="submit" className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            로그인
          </button> 
        </form>
      </div>
    </div>
  );
}
