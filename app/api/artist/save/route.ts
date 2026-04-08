import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/serverAuth';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { channelId, videos } = body;

    console.log('channelId:', channelId);
    console.log('선택된 영상:', videos?.length);

    // 🔥 필수 validation
    if (!channelId || !videos || videos.length === 0) {
      return NextResponse.json(
        { message: '잘못된 요청입니다.' },
        { status: 400 }
      );
    }

    console.log(JSON.stringify({
      channelId,
      videos
    }, null, 2));

    // 백엔드로 그대로 전달
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_SERVER_HOST}/api/channel/save`,
      req,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',   // 핵심
        },
        body: JSON.stringify({
          channelId,
          videos
        })
      }
    );

    // 🔥 백엔드 응답 처리
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || '서버 오류' },
        { status: res.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('save api error:', error);

    return NextResponse.json(
      { message: '서버 내부 오류' },
      { status: 500 }
    );
  }
}