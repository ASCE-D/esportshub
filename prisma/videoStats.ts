// prisma/videoStats.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface VideoStats {
  id: number;
  videoId: string;
  title: string;
  viewCount: number;
  likeCount: number;
  // Add other statistics fields as needed
}

export const videoStatsPrisma = prisma.videoStats;

export async function createVideoStats(data: VideoStats): Promise<VideoStats> {
  return prisma.videoStats.create({
    data,
  });
}
