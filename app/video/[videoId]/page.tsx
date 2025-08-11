'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactPlayer from 'react-player';
import { getMusicItem } from '../../../api/musicApi';

interface VideoDetail {
  videoId: string;
  title?: string;
}

export default function VideoPage() {
  const router = useRouter();
  const { videoId } = useParams();
  const [videoDetail, setVideoDetail] = useState<VideoDetail | null>(null);
  const playerRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);

  // 전체화면 요청 함수
  const requestFullScreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if ((el as any).webkitRequestFullscreen) {
      (el as any).webkitRequestFullscreen();
    } else if ((el as any).mozRequestFullScreen) {
      (el as any).mozRequestFullScreen();
    } else if ((el as any).msRequestFullscreen) {
      (el as any).msRequestFullscreen();
    }
  };

   const handleFullScreen = () => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
      } else if ((containerRef.current as any).mozRequestFullScreen) {
        (containerRef.current as any).mozRequestFullScreen();
      } else if ((containerRef.current as any).msRequestFullscreen) {
        (containerRef.current as any).msRequestFullscreen();
      }
    }
  };

  const handleVideo = (videoId: string) => {
    console.log("videoEnded...");
    if (videoId) {
      getMusicItem(videoId)
        .then(data => {
          console.log("data => " + JSON.stringify(data));
          setVideoDetail(data);
          setLoading(false);
        })
        .catch(err => console.log(err));
    }
  };

  useEffect(() => {
    if (videoDetail?.videoId) {
      router.replace(`/video/${videoDetail.videoId}`);
    }
  }, [videoDetail]);

  // 컴포넌트 마운트 시 전체화면 요청
  useEffect(() => {
    const timer = setTimeout(() => {
      requestFullScreen();
    }, 500); // 브라우저 렌더링 안정화 대기 (필요 시 조절)

    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: 800 }}>
      <ReactPlayer
        ref={playerRef}
        src={`https://www.youtube.com/watch?v=${String(videoId)}`}
        playing={true}
        controls={true}
        style={{ position: 'absolute', top: 0, left: 0 }}
	      onEnded={() => handleVideo(String(videoId))}
      />
      {/*<button
        onClick={handleFullScreen}
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          padding: '6px 12px',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        전체화면
      </button>*/}
    </div>
  );
}
