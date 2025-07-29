// api/LoginApi.ts
import axios from "axios"
import { API_SERVER_HOST } from "@/utils/config";

const host = `${API_SERVER_HOST}/api/member`

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
    const response = await axios.post(`${host}/login`, form, header);
    return response.data;
  } catch (error) {
    console.error("로그인 에러:", error);
    throw error;
  }
};