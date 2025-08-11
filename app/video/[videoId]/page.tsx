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

  const handleVideo = (videoId: string) => {
    console.log("videoEnded...");
    if (videoId) {
      getMusicItem(videoId)
        .then(data => {
          console.log("data => " + JSON.stringify(data));
          setVideoDetail(data);
        })
        .catch(err => console.log(err));
    }
  };

  useEffect(() => {
    if (videoDetail?.videoId) {
      router.replace(`/video/${videoDetail.videoId}`);
    }
  }, [videoDetail]);

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
