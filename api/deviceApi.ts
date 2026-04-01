import jwtAxios from "../utils/jwtUtil";
import { Device } from "@/types/Device";
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

    const response = await jwtAxios.get(`${host}/list`, {params: params});

    console.log("response=>" + JSON.stringify(response));

    // 서버가 JSON 형식의 배열을 반환한다고 가정
    // const data: Music[] = response.data;

    return response.data as Device[];

  } catch (error) {
    console.error("디바이스 내역을 불러오는 중 오류 발생:", error);
    return []; // 오류 발생 시 빈 배열 반환
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
