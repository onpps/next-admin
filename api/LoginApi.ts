// api/LoginApi.ts
import axios from "axios"
//import { API_SERVER_HOST } from "@/utils/config";

export const API_SERVER_HOST = process.env.NEXT_PUBLIC_API_SERVER_HOST;

const host = `${API_SERVER_HOST}/api/member`

export interface LoginData {
  id: string;
  password: string;
}

export interface FindIdData {
  name: string;
  phoneNumber: string;
}

export interface FindPwData {
  id: string;
  email: string;
}

export const doLogin = async (loginData: LoginData) => {
  console.log("loginData=>" + JSON.stringify(loginData));

  const header = {headers: {"Content-Type": "x-www-form-urlencoded"}}

  const form = new FormData()
  form.append('username', loginData.id);
  form.append('password', loginData.password);

  try {
    const response = await axios.post(`${host}/login`, form, header);
    return response.data;
  } catch (error) {
    console.error("로그인 에러:", error);
    throw error;
  }
};

export const dofindId = async (findData: FindIdData) => {
  console.log("findData=>" + JSON.stringify(findData));

  const header = {headers: {"Content-Type": "x-www-form-urlencoded"}}

  const form = new FormData()
  form.append('name', findData.name);
  form.append('phoneNumber', findData.phoneNumber);

  try {
    const response = await axios.post(`${host}/findId`, form, header);
    return response.data;
  } catch (error) {
    console.error("아이디 찾기 에러:", error);
    throw error;
  }
};

export const doFindPassword = async (findData: FindPwData) => {
  console.log("findData=>" + JSON.stringify(findData));

  const header = {headers: {"Content-Type": "application/json"}}

  const form = new FormData()
  form.append('id', findData.id);
  form.append('email', findData.email);

  try {
    const response = await axios.post(`${host}/sendEmail`, form, header);
    return response.data;
  } catch (error) {
    console.error("아이디 찾기 에러:", error);
    throw error;
  }
};
