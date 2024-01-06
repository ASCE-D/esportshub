"use client"
import React from "react";
import YouTube from "react-youtube";

interface YouTubePlayerProps {
  videoId: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId }) => {
  // Set up event handlers
  const onReady = (event: { target: any }) => {
    // Access the player instance
    const player = event.target as any;

    // For example, you can automatically play the video
    player.playVideo();
  };

  const onError = (error: any) => {
    console.error("YouTube Player Error:", error);
  };

  return <YouTube videoId={videoId} onReady={onReady} onError={onError} />;
};

export default YouTubePlayer;
