// api/LoginApi.ts
import axios from "axios"

const API_URL = "http://localhost:8080/api/member";

export interface LoginData {
  email: string;
  password: string;
}

export const doLogin = async (loginData: LoginData) => {
  console.log("loginData=>" + JSON.stringify(loginData));

  const header = {headers: {"Content-Type": "x-www-form-urlencoded"}}

  const form = new FormData()
  form.append('username', loginData.email);
  form.append('password', loginData.password);

  try {
    const response = await axios.post(`${API_URL}/login`, form, header);
    return response.data;
  } catch (error) {
    console.error("로그인 에러:", error);
    throw error;
  }
};

export const fetchUserInfo = async () => {
  try {
    const response = await axios.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
    return null;
  }
};
