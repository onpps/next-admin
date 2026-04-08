// utils/serverAuth.ts

/**
 * 쿠키 문자열 → 객체로 변환
 */
const parseCookies = (cookieHeader: string) => {
  return Object.fromEntries(
    cookieHeader.split('; ').map(c => {
      const [key, ...v] = c.split('=');
      return [key, v.join('=')];
    })
  );
};

/**
 * Request에서 accessToken 추출
 */
export const getAccessTokenFromRequest = (req: Request): string | null => {
  const cookieHeader = req.headers.get('cookie');

  if (!cookieHeader) return null;

  try {
    const cookies = parseCookies(cookieHeader);

    if (!cookies.member) return null;

    const decoded = decodeURIComponent(cookies.member);
    const member = JSON.parse(decoded);

    return member.accessToken || null;

  } catch (e) {
    console.error('토큰 파싱 실패:', e);
    return null;
  }
};

/**
 * 인증 포함 fetch
 */

/**
 * 인증 포함 fetch (🔥 완전 개선 버전)
 */
export const fetchWithAuth = async (
  url: string,
  req: Request,
  options: RequestInit = {}
) => {
  const accessToken = getAccessTokenFromRequest(req);

  // 🔥 Headers 객체로 통일
  const headers = new Headers(options.headers || {});

  // 🔥 JSON 기본 설정 (없을 때만)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // 🔥 Authorization (있을 때만)
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // 🔥 쿠키 전달 (Spring Session / 인증용)
  const cookie = req.headers.get('cookie');
  if (cookie) {
    headers.set('cookie', cookie);
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // 🔥 중요 (쿠키 포함)
  });
};