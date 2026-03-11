import jwtAxios from "../utils/jwtUtil";

export const API_SERVER_HOST = process.env.NEXT_PUBLIC_API_SERVER_HOST;

const host = `${API_SERVER_HOST}/api/config`;

interface configParam {
  searchSource: string;
}

interface passwordParam {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface configResponse {
  errorCode?: string;
  errorMessage?: string;
  [key: string]: any;  // 응답이 확실하지 않다면 임시로 any 사용
}

export const getConfig = async (): Promise<configResponse> => {
  try {
    const res = await jwtAxios.get<configResponse>(`${host}/get`);
    return res.data;
  } catch (error) {
    console.error('getConfig error:', error);
    throw error;
  }
};

export const saveConfig = async (param: configParam): Promise<configResponse> => {
  try {
    const res = await jwtAxios.post<configResponse>(`${host}/save`, param);
    return res.data;
  } catch (error) {
    console.error('saveConfig error:', error);
    throw error;
  }
};

export const changePassword = async (param: passwordParam): Promise<configResponse> => {
  try {
    const res = await jwtAxios.post<configResponse>(`${host}/changePassword`, param);
    return res.data;
  } catch (error) {
    console.error('saveConfig error:', error);
    throw error;
  }
};

