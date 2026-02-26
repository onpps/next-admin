declare module "yt-player" {
  export interface YTPlayerOptions {
    width?: number | string;
    height?: number | string;
    autoplay?: boolean;
  }

  type EventName = "ready" | "play" | "pause" | "ended" | "error";

  export default class YTPlayer {
    constructor(element: string | HTMLElement, options?: YTPlayerOptions);

    load(videoId: string): void;
    play(): void;
    pause(): void;
    stop(): void;
    destroy(): void;

    on(event: EventName, callback: () => void): void;
  }
}