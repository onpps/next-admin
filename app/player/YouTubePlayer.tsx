"use client";

import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

interface Props {
  videoId: string;
  onEnded?: (videoId: string) => void;
  onError?: (videoId: string) => void;
}

export interface YouTubePlayerHandle {
  playWithSound: () => void;
  loadVideo: (id: string) => void;
}

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubePlayer = forwardRef<YouTubePlayerHandle, Props>(
  ({ videoId, onEnded, onError}, ref) => {
    const playerRef = useRef<HTMLDivElement | null>(null);
    const ytPlayer = useRef<YT.Player>(null);
    const isReady = useRef(false);
    const currentVideoIdRef = useRef(videoId);

    useImperativeHandle(ref, () => ({
      playWithSound() {
        ytPlayer.current?.unMute();
        ytPlayer.current?.setVolume(100);
        ytPlayer.current?.playVideo();
      },
      loadVideo(id: string) {
        ytPlayer.current?.loadVideoById(id);
      },
    }));

    useEffect(() => {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }

      const createPlayer = () => {
        if (!playerRef.current) return;

        ytPlayer.current = new window.YT.Player(playerRef.current, {
          videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            controls: 1,
            fs: 1,
            rel: 0,
            playsinline: 1,
          },
          events: {
            onReady: (event: YT.PlayerEvent) => {
              isReady.current = true;

              event.target.playVideo();

              // 약간 딜레이 후 소리 켜기
              setTimeout(() => {
                event.target.unMute();
                event.target.setVolume(100);
              }, 500);
            },
            onStateChange: (event: YT.OnStateChangeEvent) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                onEnded?.(currentVideoIdRef.current);
              }
            },
            // 재생 불가 대응
            onError: (event: YT.OnErrorEvent) => {
              console.log("❌ 영상 에러 발생:", event.data);

              // 101,150 = 외부재생 차단 / 100 삭제 / 2 잘못된 ID
              onError?.(currentVideoIdRef.current);
            },
          },
        });
      };

      if (window.YT && window.YT.Player) {
        createPlayer();
      } else {
        window.onYouTubeIframeAPIReady = createPlayer;
      }

      return () => {
        ytPlayer.current?.destroy();
      };
    }, [videoId, onEnded, onError]); // 🔥 videoId 제거 (한 번만 생성)

    // 🔥 videoId 변경 시 기존 플레이어에 영상만 교체
    useEffect(() => {

      console.log("videoId=>" + videoId);

      currentVideoIdRef.current = videoId;

      //if (isReady.current && ytPlayer.current) {
        //ytPlayer.current.loadVideoById(videoId);
      //}
    }, [videoId]);

    return <div ref={playerRef} className="w-full h-full" />;
  }
);

YouTubePlayer.displayName = "YouTubePlayer";

export default YouTubePlayer;