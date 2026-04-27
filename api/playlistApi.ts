import jwtAxios from "../utils/jwtUtil";
import { Playlist } from "@/types/Playlist";
//import { API_SERVER_HOST } from "@/utils/config";

export const API_SERVER_HOST = process.env.NEXT_PUBLIC_API_SERVER_HOST;

const host = `${API_SERVER_HOST}/api/playlist`

interface musicResponse {
  errorCode?: string;
  errorMessage?: string;
  [key: string]: any;  // 응답이 확실하지 않다면 임시로 any 사용
}

interface playListParam {
  playlistId: string;
  title: string;
  channel: string;
  thumbnail: string;
}

//기본 재생음악 리스트
export async function getDefaultMusicList(): Promise<Playlist[]> {
  try {

    const response = await jwtAxios.get(`${host}/list`);

    console.log("response=>" + JSON.stringify(response));

    // 서버가 JSON 형식의 배열을 반환한다고 가정
    // const data: Music[] = response.data;

    return response.data as Playlist[];

  } catch (error) {
    console.error("getDefaultMusicList error:", error);
    return []; // 오류 발생 시 빈 배열 반환
  }
}

//기본 재생음악 추가 
export const registerDefaultPlaylist = async (param: playListParam): Promise<musicResponse> => {
  try {
    const res = await jwtAxios.post<musicResponse>(`${host}/default`, param);
    return res.data;
  } catch (error: unknown) {
    console.error('registerDefaultMusic error:', error);

    // 그냥 그대로 던짐 (핵심)
    throw error;
  }
};

//기본 재생음악 삭제 
export const deletePlaylist = async (playlistId: string): Promise<musicResponse> => {
  try {

    const res = await jwtAxios.delete<musicResponse>(`${host}/delete`, {
      data: { playlistId }, //body는 data에 넣어야 함
    });

    return res.data;
  } catch (error: any) {
    console.error('deletePlaylist error:', error);

    // 백엔드 메시지 추출
    const message =
      error?.response?.data?.message ||
      error?.response?.data ||
      '기본 재생목록 삭제 중 오류가 발생했습니다.';

    // 프론트에서 쓰기 쉽게 문자열로 throw
    throw new Error(message);
  }
};