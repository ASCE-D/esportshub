"use client"
import React, { useEffect, useState } from "react";
import YouTubePlayer from "~/app/_components/YoutubePlayer";
import axios from "axios";

const Videos = () => {
  const [videoId, setVideoId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchApi = async () => {
      console.log("inside function");
      try {
        const { data } = await axios.get(
          "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=valorant%20clutch%20moment&key=AIzaSyCIK1jmqlTU65CJtUXAzmQ6W6VFfCKD8yo",
        );
        const firstVideoId = data.items[0]?.id?.videoId;
        setVideoId(firstVideoId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Load data on component mount
    fetchApi();
  }, []);

  return (
    <div>
      {videoId !== undefined ? (
        <YouTubePlayer videoId={videoId} />
      ) : (
        <p>Loading...</p>
      )}
      {/* Additional content can be placed here, after the YouTubePlayer or loading message */}
    </div>
  );
};

export default Videos;
