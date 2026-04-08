declare namespace YT {
  class Player {
    constructor(element: any, options: any);
    loadVideoById(videoId: string): void;
    playVideo(): void;
    unMute(): void;
    setVolume(volume: number): void;
    destroy(): void;
  }

  interface PlayerEvent {
    target: Player;
  }

  interface PlayerStateChangeEvent {
    data: number;
    target: Player;
  }

  interface OnStateChangeEvent {
    data: number;
  }

  interface OnErrorEvent {
    data: number;
    target: any;
  }

  const PlayerState: {
    ENDED: number;
  };
}