import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getCookie, setCookie } from "./cookieUtil";
import { API_SERVER_HOST } from "./config";
import { sweetToast } from '@/utils/sweetAlert';

const jwtAxios: AxiosInstance = axios.create({
  withCredentials: true,  // 쿠키 포함 전송!
});

interface MemberInfo {
  accessToken: string;
  refreshToken: string;
}

const refreshJWT = async (accessToken: string, refreshToken: string): Promise<MemberInfo> => {
  const host = API_SERVER_HOST;
  const headers = { headers: { "Authorization": `Bearer ${accessToken}` } };
  const res = await axios.get(`${host}/api/member/refresh?refreshToken=${refreshToken}`, headers);
  return res.data;
};

// before request
const beforeReq = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
  console.log("before request.............");

  const memberInfo = getCookie("member") as MemberInfo | undefined;

  console.log("memberInfo=>" + JSON.stringify(memberInfo));

  if (!memberInfo || memberInfo.accessToken === "undefined" || memberInfo.refreshToken === "undefined") {
    console.log("Member NOT FOUND");
    return Promise.reject({
      response: { data: { error: "REQUIRE_LOGIN" } }
    });
  }

  config.headers.Authorization = `Bearer ${memberInfo.accessToken}`;
  return config;
};

const requestFail = (error: any) => {
  console.log("request error............");
  return Promise.reject(error);
};

// before response
const beforeRes = async (res: AxiosResponse): Promise<AxiosResponse> => {
  console.log("before return response...........");

  const data = res.data;

  console.log("data=>" + JSON.stringify(data));

  if (data && data.error === "ERROR_ACCESS_TOKEN") {
    const memberCookieValue = getCookie("member") as MemberInfo | undefined;

    if (!memberCookieValue) {
      console.log("쿠키에 member 값이 없음, 로그인 페이지로 이동");
      window.location.href = "/login";
      return Promise.reject(res);
    }

    if (!memberCookieValue.refreshToken || memberCookieValue.refreshToken === "undefined") {
      console.log("refreshToken이 유효하지 않음, 로그인 페이지로 이동");
      window.location.href = "/login";
      return Promise.reject(res);
    }

    try {
      const result = await refreshJWT(memberCookieValue.accessToken, memberCookieValue.refreshToken);
      console.log("refreshJWT RESULT =>", result);

      memberCookieValue.accessToken = result.accessToken;
      memberCookieValue.refreshToken = result.refreshToken;
      setCookie("member", JSON.stringify(memberCookieValue), 1);

      const originalRequest = res.config;
      originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;

      return await axios(originalRequest);
    } catch (refreshError) {
      console.error("refreshJWT 실패, 로그인 페이지로 이동:", refreshError);
      window.location.href = "/login";
      return Promise.reject(refreshError);
    }
  }

  return res;
};

const responseFail = (error: any) => {
  console.log("response fail error.............");
  console.log("error=>" + JSON.stringify(error));

  const errorMsg = error.response.data.error;

  console.log("errorMsg=>" + errorMsg);

  if(errorMsg === 'REQUIRE_LOGIN'){
    sweetToast('로그인 해야만 합니다.');
    window.location.href = "/login";

    return
  }

  //인증에러나 Expired일 경우
  if(error.status === 401){
    sweetToast('로그인 정보가 만료되었습니다.');
    window.location.href = "/login";
  }

  return Promise.reject(error);
};

// 인터셉터 등록
jwtAxios.interceptors.request.use(beforeReq, requestFail);
jwtAxios.interceptors.response.use(beforeRes, responseFail);

export default jwtAxios;
