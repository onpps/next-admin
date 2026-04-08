import jwtAxios from "../utils/jwtUtil";
import { Channel } from "@/types/Channel";

export const API_SERVER_HOST = process.env.NEXT_PUBLIC_API_SERVER_HOST;

const host = `${API_SERVER_HOST}/api/channel`;

interface channelResponse {
  errorCode?: string;
  errorMessage?: string;
  [key: string]: any;  // 응답이 확실하지 않다면 임시로 any 사용
}

type Video = {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    publishedAt: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
};

interface artistParam {
  channelId: string;
  videos: Video[];
}

//아티스트 리스트
export async function getArtistList(keyword: string): Promise<Channel[]> {
  try {
    const response = await jwtAxios.get(`${host}/search`, {
      params: { keyword }
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//아티스트 추가 
export const registerArtist = async (param: artistParam): Promise<channelResponse> => {
  try {

    console.log("param=>" + JSON.stringify(param));

    const res = await jwtAxios.post<channelResponse>(`${host}/save`, param);
    return res.data;
  } catch (error: any) {
    console.error('registerArtist error:', error);

    // 백엔드 메시지 추출
    const message =  '아티스트 등록 중 오류가 발생했습니다.';

    // 프론트에서 쓰기 쉽게 문자열로 throw
    throw new Error(message);
  }
};