import { Cookies } from "react-cookie";

const cookies = new Cookies();

/**
 * 쿠키 저장 함수
 * @param name 쿠키 이름
 * @param value 쿠키 값
 * @param days 유효기간 (일수)
 */
export const setCookie = (name: string, value: string, days: number): void => {
    const expires = new Date();
    expires.setUTCDate(expires.getUTCDate() + days);

    cookies.set(name, value, { path: '/', expires });
};

/**
 * 쿠키 가져오기 함수
 * @param name 쿠키 이름
 * @returns 쿠키 값 or undefined
 */
export const getCookie = (name: string): string | undefined => {
    return cookies.get(name);
};

/**
 * 쿠키 삭제 함수
 * @param name 쿠키 이름
 * @param path 경로 (기본값 '/')
 */
export const removeCookie = (name: string, path: string = "/"): void => {
    cookies.remove(name, { path });
};
