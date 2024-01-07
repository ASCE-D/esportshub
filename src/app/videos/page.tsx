"use client";
import React, { useEffect, useState } from "react";
import YouTubePlayer from "~/app/_components/YoutubePlayer";
import axios from "axios";

const Videos = () => {
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);

  useEffect(() => {
    const fetchApi = async () => {
      console.log("inside function");
      try {
        const { data } = await axios.get(
          "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1000&q=valorant%20clutch&type=video&videoDuration=short&videoType=videoTypeUnspecified&key=AIzaSyCIK1jmqlTU65CJtUXAzmQ6W6VFfCKD8yo",
        );
        const ids = data.items.map((item) => item.id.videoId).filter(Boolean);
        setVideoIds(ids);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Load data on component mount
    fetchApi();
  }, []);

  const handleNextVideo = () => {
    // Change to the next video
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoIds.length);
  };
  console.log(videoIds);
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      {videoIds.length > 0 && (
        <YouTubePlayer
          key={videoIds[currentVideoIndex]}
          videoId={videoIds[currentVideoIndex]}
          onNextVideo={handleNextVideo}
        />
      )}
      {/* Additional content can be placed here, after the YouTubePlayer or loading message */}
    </div>
  );
};

export default Videos;
