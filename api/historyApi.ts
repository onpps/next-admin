import jwtAxios from "../utils/jwtUtil";
import { HistoryListResponse } from "../types/History";
//import { API_SERVER_HOST } from "@/utils/config";

export const API_SERVER_HOST = process.env.NEXT_PUBLIC_API_SERVER_HOST;

const host = `${API_SERVER_HOST}/api/history`

interface PageParam {
  page: number;
  size: number;
}

//로그인 기록 리스트
export async function fetchHistorys(params: PageParam): Promise<HistoryListResponse> {
  try {

    console.log("params=>" + JSON.stringify(params));

    const response = await jwtAxios.post(`${host}/list`, params);

    return response.data as HistoryListResponse;

  } catch (error) {
    console.error("로그인 기록 내역을 불러오는 중 오류 발생:", error);
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