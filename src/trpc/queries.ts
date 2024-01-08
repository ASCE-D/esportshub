// trpc/queries.ts
import { z } from 'zod';
import { createEffect, trpc } from '@trpc/client';
import { createYupSchema } from '@trpc/server';
import axios from 'axios';

const BASE_URL = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=valorant%20clutch%20moment&key=YOUR_YOUTUBE_API_KEY';
const STATS_URL = 'https://www.googleapis.com/youtube/v3/videos?part=statistics&id=';

export const fetchVideosAndStats = createEffect.input(z.string()).query((input) => {
  // Fetch videos
  const videosData = axios.get(BASE_URL).then((response) => response.data);

  // Extract video IDs
  const videoIds = videosData.items.map((video) => video.id.videoId);

  // Fetch stats for each video
  const videoStats = Promise.all(
    videoIds.map(async (videoId) => {
      const statsData = await axios.get(`${STATS_URL}${videoId}&key=YOUR_YOUTUBE_API_KEY`);
      const statistics = statsData.items[0].statistics;

      // Create a new object with the required data
      return {
        videoId: videoId,
        title: statsData.items[0].snippet.title,
        viewCount: parseInt(statistics.viewCount),
        likeCount: parseInt(statistics.likeCount),
        // Add other statistics fields as needed
      };
    }),
  );

  // Save the objects to the database using Prisma
  videoStats.forEach(async (stats) => {
    await createVideoStats(stats);
  });

  return videoStats;
});

export const fetchVideosAndStatsYup = createYupSchema(fetchVideosAndStats);
export const fetchVideosAndStatsT = trpc.create.t(fetchVideosAndStats);
