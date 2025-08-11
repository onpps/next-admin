import jwtAxios from "../utils/jwtUtil";
import { MemberListResponse, Member } from "../types/Member";
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

interface memberResponse {
  errorCode?: string;
  errorMessage?: string;
  [key: string]: any;  // 응답이 확실하지 않다면 임시로 any 사용
}

interface userParam {
  id: string;
  password: string;
}

interface limitParam {
  id: string;
  numberOfSongLimit : number;
}

//계정 리스트
export async function getDeviceList(params: PageParam): Promise<Member[]> {
  try {

    const response = await jwtAxios.get(`${host}/list`, {params: params});

    console.log("response=>" + JSON.stringify(response));

    // 서버가 JSON 형식의 배열을 반환한다고 가정
    // const data: Music[] = response.data;

    return response.data as Member[];

  } catch (error) {
    console.error("계정 내역을 불러오는 중 오류 발생:", error);
    return []; // 오류 발생 시 빈 배열 반환
  }
}

//계정추가
export const registerUser = async (param: userParam): Promise<memberResponse> => {
  try {
    const res = await jwtAxios.post<memberResponse>(`${host}/registerUser`, param);
    return res.data;
  } catch (error) {
    console.error('registerUser error:', error);
    throw error;
  }
};

//비밀번호 변경
export const changePassword = async (param: userParam): Promise<memberResponse> => {
  try {
    const res = await jwtAxios.post<memberResponse>(`${host}/changePassword`, param);
    return res.data;
  } catch (error) {
    console.error('changePassword error:', error);
    throw error;
  }
};

//단말기계정 차단
export const stopDevice = async (param: userParam): Promise<memberResponse> => {
  try {
    const res = await jwtAxios.post<memberResponse>(`${host}/stop`, param);
    return res.data;
  } catch (error) {
    console.error('stopMember error:', error);
    throw error;
  }
};

//단말기계정 사용재개
export const startDevice = async (param: userParam): Promise<memberResponse> => {
  try {
    const res = await jwtAxios.post<memberResponse>(`${host}/start`, param);
    return res.data;
  } catch (error) {
    console.error('startMember error:', error);
    throw error;
  }
};

//신청곡갯수 수정
export const changeNumberOfSongLimit = async (param: limitParam): Promise<memberResponse> => {
  try {
    const res = await jwtAxios.post<memberResponse>(`${host}/changeNumberOfSongLimit`, param);
    return res.data;
  } catch (error) {
    console.error('changeNumberOfSongLimit error:', error);
    throw error;
  }
};
