import axios from 'axios';
import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/serverAuth';

export async function GET(req: Request) {
  try {
    //const cookieHeader = req.headers.get('cookie'); //핵심
    //console.log("cookieHeader=>" + JSON.stringify(cookieHeader))

    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_SERVER_HOST}/api/channel/list`,
      req
    );
    
    const data = await res.json();

    return NextResponse.json(data, {
      status: res.status,
    });

  } catch (err: unknown) {
      const errorMsg = axios.isAxiosError(err) ? err.response?.data?.error : undefined;

      if (errorMsg === 'REQUIRE_LOGIN') {
        return NextResponse.json(
          { error: 'REQUIRE_LOGIN' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: 'SERVER_ERROR' },
        { status: 500 }
      );
    }
}