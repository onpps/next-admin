import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

interface Props {
  url: string;
}

export default function HlsPlayer({ url }: Props) {

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {

    const video = videoRef.current;

    if (!video) return;

    if (Hls.isSupported()) {

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hlsRef.current = hls;

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });

    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.play().catch(() => {});
    }

    // 🔴 cleanup (핵심)
    return () => {

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }

    };

  }, [url]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      className="w-full rounded"
    />
  );
}