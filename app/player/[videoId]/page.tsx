"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import YouTubePlayer, {
  YouTubePlayerHandle,
} from "../YouTubePlayer";
import { getMusicItem } from "@/api/musicApi";

interface VideoDetail {
  videoId: string;
}

export default function Page() {
  const params = useParams();
  const initialVideoId = params.videoId as string;

  const [videoDetail, setVideoDetail] = useState<VideoDetail | null>(null);
  
  const [videoId, setVideoId] = useState<string>("");
  const [started, setStarted] = useState(false);

  const playerRef = useRef<YouTubePlayerHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialVideoId) {
      setVideoId(initialVideoId);
    }
  }, [initialVideoId]);

  useEffect(() => {
    console.log("videoDetail=>" + JSON.stringify(videoDetail));
    if (videoDetail) {
      setVideoId(videoDetail.videoId);
      //playerRef.current?.loadVideo(videoDetail.videoId);
    }
  }, [videoDetail]);

  const enterFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      }
    } catch (err) {
      console.error("전체화면 전환 실패:", err);
    }
  };

  const handleVideo = (videoId: string) => {
    console.log(videoId + " videoEnded...");
    if (videoId) {
      getMusicItem(videoId)
        .then(data => {
          console.log("data => " + JSON.stringify(data));
          setVideoDetail(data);
        })
        .catch(err => console.log(err));
    }
  };

  if (!videoId) return null;

  console.log("videoId=>" + videoId);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen bg-black"
    >
      {/* started 이후에만 Player 생성 */}
      {started && (
        <YouTubePlayer
          ref={playerRef}
          videoId={videoId}
          onEnded={handleVideo}
        />
      )}

      {!started && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
          <button
            onClick={async () => {
              setStarted(true);
              await enterFullscreen();        // 🔥 전체화면 진입
              playerRef.current?.playWithSound(); // 🔥 소리 + 재생
            }}
            className="bg-white text-black px-6 py-3 rounded-lg text-lg"
          >
            ▶ 매장 재생 시작
          </button>
        </div>
      )}
    </div>
  );
}