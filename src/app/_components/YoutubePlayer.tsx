"use client"
import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";

interface YouTubePlayerProps {
  videoId?: string;
  onNextVideo: () => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, onNextVideo }) => {
  const [showNextVideoMessage, setShowNextVideoMessage] = useState(false);

  const onReady = (event: { target: any }) => {
    const player = event.target as any;
    player.playVideo();
  };

  const onStateChange = (event: { target: any; data: number }) => {
    if (event.data === 0) {
      // Video ended
      setShowNextVideoMessage(true);

      // Wait for 5 seconds and then trigger the next video
      setTimeout(() => {
        setShowNextVideoMessage(false);
        onNextVideo();
      }, 5000);
    }
  };

  const onError = (error: any) => {
    console.error("YouTube Player Error:", error);
  };

  return (
    <div>
      {showNextVideoMessage && <p>Next video in 5 seconds...</p>}
      <YouTube
        videoId={videoId}
        onReady={onReady}
        onError={onError}
        onStateChange={onStateChange}
        className="w-full max-w-2xl"
      />
    </div>
  );
};

export default YouTubePlayer;
