import jwtAxios from "../utils/jwtUtil";
import { DashboardListResponse } from "../types/Dashboard";
//import { API_SERVER_HOST } from "@/utils/config";

export const API_SERVER_HOST = process.env.NEXT_PUBLIC_API_SERVER_HOST;

const host = `${API_SERVER_HOST}/api/dashboard`

//계정 리스트
export async function getDashboardList(): Promise<DashboardListResponse> {
  try {
    const response = await jwtAxios.get(`${host}/list`);

    console.log("response=>" + JSON.stringify(response));

    // 서버가 JSON 형식의 배열을 반환한다고 가정
    // const data: Music[] = response.data;

    return response.data as DashboardListResponse;

  } catch (error) {
    console.error("대시보드 내역을 불러오는 중 오류 발생:", error);
    
    return {
      playList: [], // ✅ 타입 맞춤
    };

  }
}