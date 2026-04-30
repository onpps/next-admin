declare namespace YT {
  class Player {
    constructor(element: any, options: any);

    loadVideoById(videoId: string): void;
    playVideo(): void;
    pauseVideo(): void; 
    stopVideo(): void;
    unMute(): void;
    setVolume(volume: number): void;
    destroy(): void;
    
    //소스에서 사용하는 메서드들
    getDuration(): number;
    getCurrentTime(): number;
  }

  // 기본 이벤트 인터페이스
  interface PlayerEvent {
    target: Player;
  }

  // 상태 변경 이벤트
  interface OnStateChangeEvent {
    data: number;
    target: Player;
  }

  // 에러 이벤트
  interface OnErrorEvent {
    data: number;
    target: Player;
  }

  // ✅ 에러가 났던 PlayerState 객체 정의
  const PlayerState: {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;     // 👈 PAUSED 추가
    BUFFERING: number;
    CUED: number;
  };
}
