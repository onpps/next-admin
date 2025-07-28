"use client";

import { useRouter } from "next/navigation";
//import { AppDispatch, RootState } from "@/store";
//import { login, loginPostAsync, logout } from "@/slices/loginSlice";
//import { registerMember } from "@/api/memberApi";

const useCustomLogin = () => {
  //const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  //const loginState = useSelector((state: RootState) => state.loginSlice);
  //const isLogin = Boolean(loginState.email);

  const exceptionHandle = (ex: any) => {
    console.error("Exception:", ex);

    const errorMsg = ex?.response?.data?.error;

    if (errorMsg === "REQUIRE_LOGIN") {
      alert("로그인이 필요합니다.");
      router.push(`/member/login?error=${errorMsg}`);
      return;
    }

    if (errorMsg === "ERROR_ACCESSDENIED") {
      alert("해당 메뉴를 사용할 수 있는 권한이 없습니다.");
      router.push(`/member/login?error=${errorMsg}`);
    }
  };

  /*const doLogin = async (loginParam: { email: string; password: string }) => {
    try {
      const action = await dispatch(loginPostAsync(loginParam));
      console.log("action =>", JSON.stringify(action));
      return action.payload;
    } catch (error) {
      exceptionHandle(error);
      throw error;
    }
  };

  const doRegister = async (registerParam: { email: string; password: string; name: string }) => {
    try {
      const result = await registerMember(registerParam);
      console.log("result =>", JSON.stringify(result));
      dispatch(login(result));  // 저장
      return result;
    } catch (error) {
      exceptionHandle(error);
      throw error;
    }
  };

  const doLogout = () => {
    dispatch(logout());
  };
*/
  const moveToPath = (path: string) => {
    router.replace(path);
  };

  const moveToLogin = () => {
    router.replace("/member/login");
  };

  return {
    //loginState,
    //isLogin,
   // doLogin,
   // doLogout,
   // doRegister,
    moveToPath,
    moveToLogin,
    exceptionHandle,
  };
};

export default useCustomLogin;
