import axios from "axios";

import jwtAxios from "../utils/jwtUtil";
import { Device } from "@/types/Device";
import { sweetToast } from '@/utils/sweetAlert'; 
//import { API_SERVER_HOST } from "@/utils/config";

export const API_SERVER_HOST = process.env.NEXT_PUBLIC_API_SERVER_HOST;

const host = `${API_SERVER_HOST}/api/device`

interface PageParam {
  page: number;
  size: number;
  genre?: string;
  title?: string;
  author?: string;
}

interface deviceResponse {
  errorCode?: string;
  errorMessage?: string;
  [key: string]: any;  // 응답이 확실하지 않다면 임시로 any 사용
}

interface Param {
  id: string;
  password: string;
}

interface deviceParam {
  id: string;
}

interface limitParam {
  id: string;
  numberOfSongLimit : number;
}

//계정 리스트
export async function getDeviceList(params: PageParam): Promise<Device[]> {
  try {

    const response = await jwtAxios.get(`${host}/list`, { params });
    return response.data as Device[];

  } catch (error) {

    // Axios 에러 처리
    if (axios.isAxiosError(error)) {

      const status = error.response?.status;
      const message = error.response?.data?.message;

      console.log("status =>", status);
      console.log("message =>", message);

      // 403 : 구독 만료
      if (status === 403) {
        sweetToast(message || "구독이 만료되었습니다.");

        window.location.href = "/purchase";

        return [];
      }

      // 401 : 로그인 필요
      if (status === 401) {
        //alert(message || "로그인이 필요합니다.");
        sweetToast(message || "로그인이 필요합니다.");

        window.location.href = "/login";

        return [];
      }
    }

    // 진짜 서버 오류
    console.log("디바이스 내역 조회 실패");

    return [];
  }
}

//단말기 추가
export const registerDivice = async (param: deviceParam): Promise<deviceResponse> => {
  try {
    const res = await jwtAxios.post<deviceResponse>(`${host}/registerDevice`, param);
    return res.data;
  } catch (error) {
    console.error('registerUser error:', error);
    throw error;
  }
};

//단말기 삭제
export const deleteDevice = async (id: string): Promise<deviceResponse> => {
  try {
    const res = await jwtAxios.post<deviceResponse>(`${host}/deleteDevice`, id);
    return res.data;
  } catch (error) {
    console.error('deleteDevice error:', error);
    throw error;
  }
};

//단말기계정 차단
export const stopDevice = async (param: deviceParam): Promise<deviceResponse> => {
  try {
    const res = await jwtAxios.post<deviceResponse>(`${host}/stop`, param);
    return res.data;
  } catch (error) {
    console.error('stopMember error:', error);
    throw error;
  }
};

//단말기계정 사용재개
export const startDevice = async (param: deviceParam): Promise<deviceResponse> => {
  try {
    const res = await jwtAxios.post<deviceResponse>(`${host}/start`, param);
    return res.data;
  } catch (error) {
    console.error('startMember error:', error);
    throw error;
  }
};

//신청곡갯수 수정
export const changeNumberOfSongLimit = async (param: limitParam): Promise<deviceResponse> => {
  try {
    const res = await jwtAxios.post<deviceResponse>(`${host}/changeNumberOfSongLimit`, param);
    return res.data;
  } catch (error) {
    console.error('changeNumberOfSongLimit error:', error);
    throw error;
  }
};


//단말기계정 신청갯수 초기화
export const resetNumberOfSongRequests = async (param: deviceParam): Promise<deviceResponse> => {
  try {
    const res = await jwtAxios.put<deviceResponse>(`${host}/resetNumberOfSongRequests`, param);
    return res.data;
  } catch (error) {
    console.error('resetNumberOfSongRequests error:', error);
    throw error;
  }
};

//현재 연결된 태블릿 연결 해제
export const unpairDevice = async (param: deviceParam): Promise<deviceResponse> => {
  try {
    const res = await jwtAxios.post<deviceResponse>(`${host}/unpair`, param);
    return res.data;
  } catch (error) {
    console.error('unpairDevice error:', error);
    throw error;
  }
};
