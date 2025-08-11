import jwtAxios from "../utils/jwtUtil";
import { MusicListResponse, PlayListResponse } from "../types/Music";
//import { API_SERVER_HOST } from "@/utils/config";

export const API_SERVER_HOST = process.env.NEXT_PUBLIC_API_SERVER_HOST;

const host = `${API_SERVER_HOST}/api/music`

interface PageParam {
  page: number;
  size: number;
  genre?: string;
  title?: string;
  author?: string;
}

interface MusicParam {
  mno: string;
  cancelReason: string;
}

interface MusicResponse {
  errorCode?: string;
  errorMessage?: string;
  [key: string]: any;  // 응답이 확실하지 않다면 임시로 any 사용
}

export type MusicSortParam = {
  mno: string;
  sort: number;
};

//음악 리스트
export async function fetchMusics(params: PageParam): Promise<MusicListResponse> {
  try {

    console.log("params=>" + JSON.stringify(params));

    const response = await jwtAxios.post(`${host}/list`, params);

    // 서버가 JSON 형식의 배열을 반환한다고 가정
    // const data: Music[] = response.data;

    return response.data as MusicListResponse;

  } catch (error) {
    console.error("음악 내역을 불러오는 중 오류 발생:", error);
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

//플레이 리스트
export async function fetchPlayList(params: PageParam): Promise<PlayListResponse> {
  try {

    console.log("params=>" + JSON.stringify(params));

    const response = await jwtAxios.post(`${host}/playList`, params);

    // 서버가 JSON 형식의 배열을 반환한다고 가정
    // const data: Music[] = response.data;

    return response.data as PlayListResponse;

  } catch (error) {
    console.error("플레이 내역을 불러오는 중 오류 발생:", error);
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

export const getMusicItem = async (videoId: string) => {
  const res = await jwtAxios.get(`${host}/${videoId}`);

  return res.data;
}

//비디오 중지
export const stopMusic = async (param: MusicParam): Promise<MusicResponse> => {
  try {
    const res = await jwtAxios.post<MusicResponse>(`${host}/stop`, param);
    return res.data;
  } catch (error) {
    console.error('cancelPayment error:', error);
    throw error;
  }
};

//비디오 사용재개
export const startMusic = async (param: MusicParam): Promise<MusicResponse> => {
  try {
    const res = await jwtAxios.post<MusicResponse>(`${host}/start`, param);
    return res.data;
  } catch (error) {
    console.error('cancelPayment error:', error);
    throw error;
  }
};

//플레이 중지
export const stopMusicItem = async (param: MusicParam): Promise<MusicResponse> => {
  try {
    const res = await jwtAxios.post<MusicResponse>(`${host}/itemAdminCancelYn`, param);
    return res.data;
  } catch (error) {
    console.error('stopMusicItem error:', error);
    throw error;
  }
};

//플레이 사용재개
export const startMusicItem = async (param: MusicParam): Promise<MusicResponse> => {
  try {
    const res = await jwtAxios.post<MusicResponse>(`${host}/itemAdminCancelYn`, param);
    return res.data;
  } catch (error) {
    console.error('startMusicItem error:', error);
    throw error;
  }
};

export const updateNewSort = async (param: MusicSortParam[]): Promise<MusicResponse> => {
  try {
    const res = await jwtAxios.post<MusicResponse>(`${host}/updateSort`, param);
    return res.data;
  } catch (error) {
    console.error('startMusicItem error:', error);
    throw error;
  }
};
