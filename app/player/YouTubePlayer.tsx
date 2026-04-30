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
  ({ videoId, onEnded, onError }, ref) => {
    const playerRef = useRef<HTMLDivElement | null>(null);
    const ytPlayer = useRef<YT.Player | null>(null);
    const isReady = useRef(false);
    const videoEndTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    const currentVideoIdRef = useRef(videoId); // 현재 비디오 ID 저장용

    // 부모에서 호출할 수 있는 메서드
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

    // 타이머 정리 함수
    const clearEndTimer = () => {
      if (videoEndTimer.current) {
        clearInterval(videoEndTimer.current);
        videoEndTimer.current = null;
      }
    };

    useEffect(() => {
      // 1. API 스크립트 로드
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }

      const createPlayer = () => {
        if (!playerRef.current || ytPlayer.current) return;

        ytPlayer.current = new window.YT.Player(playerRef.current, {
          videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            controls: 1,
            fs: 1,
            rel: 0,
            playsinline: 1,
            autoplay: 1, // 자동 재생 시도
          },
          events: {
            onReady: (event: YT.PlayerEvent) => {
              isReady.current = true;
              event.target.playVideo();
              setTimeout(() => {
                event.target.unMute();
                event.target.setVolume(100);
              }, 500);
            },
            onStateChange: (event: YT.OnStateChangeEvent) => {
              // videoId 대신 currentVideoIdRef.current를 사용해야 함
              const currentId = currentVideoIdRef.current;

              // 1. 영상이 종료되었을 때 (정상 종료)
              /*if (event.data === window.YT.PlayerState.ENDED) {
                console.log("✅ 유튜브 자체 종료 이벤트 실행");
                clearEndTimer();
                onEnded?.(currentId);
                return; // 여기서 끝내버리면 아래 타이머 로직이 실행될 일이 없습니다.
              }*/
              
              // 2. 영상이 재생 중일 때 (강제 종료 감시)
              if (event.data === window.YT.PlayerState.PLAYING) {
                clearEndTimer();
                videoEndTimer.current = setInterval(() => {
                  const player = event.target;
                  const currentTime = player.getCurrentTime();
                  const duration = player.getDuration();

                  // 남은 시간이 1.5초 미만이면 강제로 종료 이벤트 발생
                  if (duration > 0 && (duration - currentTime) < 1.5) {
                    console.log("⏱️ 종료 직전 감지 - 강제 다음곡 이동");
                    clearEndTimer();
                    onEnded?.(currentId); 
                  }
                }, 500);
              } else {
                // 일시정지(PAUSED) 등 재생 중이 아닐 때는 타이머 중단
                clearEndTimer();
              }
            },
            onError: (event: YT.OnErrorEvent) => {
              // 101,150 = 외부재생 차단 / 100 삭제 / 2 잘못된 ID
              console.log("❌ 영상 에러 발생:", event.data);

              const currentId = currentVideoIdRef.current;

              clearEndTimer();
              onError?.(currentId);
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
        clearEndTimer();
        ytPlayer.current?.destroy();
        ytPlayer.current = null;
      };
    }, []); // 초기 1회만 실행

    // 🔥 핵심: videoId가 변경되면 플레이어를 새로 만들지 않고 영상만 교체
    useEffect(() => {
      currentVideoIdRef.current = videoId;  
      
      if (isReady.current && ytPlayer.current) {
        console.log("🔄 영상 교체:", videoId);
        ytPlayer.current.loadVideoById(videoId);
      }
    }, [videoId]);

    return <div ref={playerRef} className="w-full h-full" />;
  }
);

YouTubePlayer.displayName = "YouTubePlayer";

export default YouTubePlayer;