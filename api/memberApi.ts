import jwtAxios from "../utils/jwtUtil";
import { MemberListResponse, Member } from "../types/Member";
import { API_SERVER_HOST } from "./config"

const host = `${API_SERVER_HOST}/api/member`

interface PageParam {
  page: number;
  size: number;
  genre?: string;
  title?: string;
  author?: string;
}

interface memeberParam {
  memberId: string;
  cancelReason: string;
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

//회원 리스트
export async function fetchMembers(params: PageParam): Promise<MemberListResponse> {
  try {

    const response = await jwtAxios.post(`${host}/list`, params);

    // 서버가 JSON 형식의 배열을 반환한다고 가정
    // const data: Music[] = response.data;

    return response.data as MemberListResponse;

  } catch (error) {
    console.error("회원 내역을 불러오는 중 오류 발생:", error);
    return {
      dtoList: [],
      pageNumList: [],
      pageRequestDTO: { page: 1, size: 10 },
      prev: false,
      next: false,
      totalCount: 0,
      prevPage: 0,
      nextPage: 0,
      totalPage: 0,
      current: 0
    };
  }
}

//비밀번호 초기화
export const resetPassword = async (id: string): Promise<memberResponse> => {
  try {
    const res = await jwtAxios.post<memberResponse>(`${host}/resetPassword?id=${id}`);
    return res.data;
  } catch (error) {
    console.error('resetPassword error:', error);
    throw error;
  }
};

//회원 차단
export const stopMember = async (param: memeberParam): Promise<memberResponse> => {
  try {
    const res = await jwtAxios.post<memberResponse>(`${host}/stop`, param);
    return res.data;
  } catch (error) {
    console.error('stopMember error:', error);
    throw error;
  }
};

//회원 사용재개
export const startMember = async (param: memeberParam): Promise<memberResponse> => {
  try {
    const res = await jwtAxios.post<memberResponse>(`${host}/start`, param);
    return res.data;
  } catch (error) {
    console.error('startMember error:', error);
    throw error;
  }
};

//계정 리스트
export async function getMembers(params: PageParam): Promise<Member[]> {
  try {

    const response = await jwtAxios.get(`${host}/getMember`, {params: params});

    console.log("response=>" + JSON.stringify(response));

    // 서버가 JSON 형식의 배열을 반환한다고 가정
    // const data: Music[] = response.data;

    return response.data as Member[];

  } catch (error) {
    console.error("계정 내역을 불러오는 중 오류 발생:", error);
    return []; // 오류 발생 시 빈 배열 반환
  }
}

