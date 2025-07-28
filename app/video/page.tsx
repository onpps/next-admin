'use client';

import React, { useState } from 'react';
import HLSPlayer from '@/components/HLSPlayer';

export default function VideoPage() {
    const [inputUrl, setInputUrl] = useState("");
    const [streamUrl, setStreamUrl] = useState("");

    const handlePlay = () => {
      // 유효한 m3u8 URL인지 확인 후 적용
      if (inputUrl.includes(".m3u8")) {
        setStreamUrl(inputUrl);
      } else {
        alert("올바른 .m3u8 HLS 스트림 URL을 입력하세요.");
      }
    };
        
    return (
      <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">🎥 HLS.js 유튜브 플레이어</h1>

      <input
        type="text"
        placeholder="HLS (.m3u8) 스트림 URL 입력"
        className="border p-2 rounded w-full max-w-2xl"
        value={inputUrl}
        onChange={(e) => setInputUrl(e.target.value)}
      />
      <button
        onClick={handlePlay}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ▶️ 재생
      </button>

      {streamUrl && <HLSPlayer url={`http://localhost:8080/proxy?url=${encodeURIComponent(streamUrl)}`} />}
    </div>
    );
  }