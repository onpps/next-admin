declare namespace YT {
  class Player {
    constructor(element: any, options: any);
    loadVideoById(videoId: string): void;
    playVideo(): void;
    unMute(): void;
    setVolume(volume: number): void;
    destroy(): void;
  }

  interface OnStateChangeEvent {
    data: number;
  }

  const PlayerState: {
    ENDED: number;
  };
}