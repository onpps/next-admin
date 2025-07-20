import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const HLSPlayer = ({ url }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (!url) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, function (event, data) {
        console.error("HLS.js error event:", data.type, data.details, data.reason || "");
      });

      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari
      video.src = url;
    }
  }, [url]);

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <video
        ref={videoRef}
        controls
        autoPlay
        className="rounded shadow w-full"
      />
    </div>
  );
};

export default HLSPlayer;
