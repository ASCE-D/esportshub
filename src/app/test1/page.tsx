"use client"

// pages/videoStats.js

// pages/videoStats.js

import React, { useState } from "react";
import { api } from "~/trpc/react";

export default function VideoStats() {
  const [videosAndStats, setVideosAndStats] = useState(null);
  const [error, setError] = useState(null);

  const fetchVideosAndStats = async () => {
    try {
      const result = await api.videostats.fetchVideosAndStats.useQuery("haha");
      console.log(result)
      if (Array.isArray(result)) {
        setVideosAndStats(result);
      } else {
        setError("Invalid data format received.");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching data.");
    }
  };

  // Call the function to fetch data when the component mounts
  fetchVideosAndStats();

  return (
    <div>
      <h1>Video Stats Page</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {videosAndStats ? (
        <div>
          <h2>Fetched Videos and Stats:</h2>
          <ul>
            {videosAndStats.map((videoStats) => (
              <li key={videoStats.videoId}>
                <strong>Title:</strong> {videoStats.title}<br />
                <strong>Video ID:</strong> {videoStats.videoId}<br />
                <strong>View Count:</strong> {videoStats.viewCount}<br />
                {/* Add other statistics fields as needed */}
                <hr />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
