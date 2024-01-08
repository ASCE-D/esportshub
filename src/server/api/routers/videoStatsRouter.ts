// videoStatsRouter.ts
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import axios from 'axios';

export const videoStatsRouter = createTRPCRouter({
  fetchVideosAndStats: protectedProcedure
    .input(z.string()) // Modify the input type based on your needs
    .query(async ({ ctx, input }) => {
      // Fetch videos
      const videosData = await fetchDataFromYouTube(input);

      // Extract video IDs
      const videoIds = videosData.items.map((video) => video.id.videoId);

      // Fetch stats for each video
      const videoStats = await Promise.all(
        videoIds.map(async (videoId) => {
          const statsData = await fetchStatsFromYouTube(videoId);

          // Extract relevant statistics
          const statistics = statsData.items[0].statistics;

          // Create a new object with the required data
          const videoStatsObject = {
            videoId: videoId,
            title: statsData.items[0].snippet.title,
            viewCount: parseInt(statistics.viewCount),
            likeCount: parseInt(statistics.likeCount),
            // Add other statistics fields as needed
          };

          // Save the object to the database
          await ctx.db.videoStats.create({ data: videoStatsObject });

          return videoStatsObject;
        }),
      );

      return videoStats;
    }),
});

async function fetchDataFromYouTube(query: string) {
    const BASE_URL = "https://youtube.googleapis.com/youtube/v3/search";
    const API_KEY = "YOUR_YOUTUBE_API_KEY"; // Replace with your actual API key
  
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          part: 'snippet',
          maxResults: 50,
          q: query,
          key: API_KEY,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching data from YouTube:', error);
      throw error;
    }
  }

async function fetchStatsFromYouTube(videoId: string) {
    const STAT_URL = "https://www.googleapis.com/youtube/v3/videos";
    const API_KEY = "YOUR_YOUTUBE_API_KEY"; // Replace with your actual API key
  
    try {
      const response = await axios.get(STAT_URL, {
        params: {
          part: 'statistics',
          id: videoId,
          key: API_KEY,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error(`Error fetching stats for video ${videoId}:`, error);
      throw error;
    }
  }
