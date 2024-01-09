// videoStatsRouter.ts
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import axios from 'axios';

const BASE_URL = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=valorant%20clutch%20moment&key=AIzaSyCIK1jmqlTU65CJtUXAzmQ6W6VFfCKD8yo";
export const videoStatsRouter = createTRPCRouter({
  fetchVideosAndStats: publicProcedure
    .input(z.string()) // Modify the input type based on your needs
    .query(async ({ ctx, input }) => {
      // Fetch videos
      const response = await axios.get(BASE_URL);
      const videosData = response.data;

      // Extract video IDs and titles
      const videoStats = videosData.items.map((video) => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;

        return { videoId, title };
      });

      // Fetch stats for each video
      await Promise.all(
        videoStats.map(async (videoStat) => {
          const statsData = await fetchStatsFromYouTube(videoStat.videoId);

          if (statsData.items && statsData.items.length > 0) {
            const statistics = statsData.items[0].statistics;

            const videoStatsObject = {
              videoId: videoStat.videoId,
              title: videoStat.title,
              viewCount: parseInt(statistics.viewCount),
              likeCount: parseInt(statistics.likeCount),
              // Add other statistics fields as needed
            };

            await ctx.db.videoStats.create({ data: videoStatsObject });
          } else {
            console.error(`Stats not found for video ${videoStat.videoId}`);
            // Handle the missing stats case appropriately
          }
        })
      );

      return videoStats;
    }),
});


// async function fetchDataFromYouTube(query: string) {
//     const BASE_URL = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=valorant%20clutch%20moment&key=AIzaSyCIK1jmqlTU65CJtUXAzmQ6W6VFfCKD8yo";
//     const API_KEY = "YOUR_YOUTUBE_API_KEY"; // Replace with your actual API key
  
//     try {
//      const response  = await axios.get(BASE_URL)
//       // , {
//       //   params: {
//       //     part: 'snippet',
//       //     maxResults: 50,
//       //     q: query,
//       //     key: API_KEY,
//       //   },
//       // });
  
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching data from YouTube:', error);
//       throw error;
//     }
//   }

// async function fetchStatsFromYouTube(videoId: string) {
//     // const STAT_URL = "https://www.googleapis.com/youtube/v3/videos";
//     const API_KEY = "YOUR_YOUTUBE_API_KEY"; // Replace with your actual API key
//     STAT_=`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=AIzaSyCIK1jmqlTU65CJtUXAzmQ6W6VFfCKD8yo`
  
//     try {
//       const response = await axios.get(STAT)
//       //   , {
//       //   params: {
//       //     part: 'statistics',
//       //     id: videoId,
//       //     key: API_KEY,
//       //   },
//       // });
  
//       return response.data;
//     } catch (error) {
//       console.error(`Error fetching stats for video ${videoId}:`, error);
//       throw error;
//     }
//   }

async function fetchStatsFromYouTube(videoId: string) {
  const API_KEY = "AIzaSyCIK1jmqlTU65CJtUXAzmQ6W6VFfCKD8yo"; // Replace with your actual API key
  const STAT_URL = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`;

  try {
    const response = await axios.get(STAT_URL);
    console.log(response)

    return response.data;
  } catch (error) {
    console.error(`Error fetching stats for video ${videoId}:`, error);
    throw error;

  }
}
