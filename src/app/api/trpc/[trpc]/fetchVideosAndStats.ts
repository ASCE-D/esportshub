// pages/api/trpc/fetchVideosAndStats.ts
import { createTRPCFetch } from "@trpc/client";
import { fetchVideosAndStatsT } from "../../../trpc/queries";

export default async function handler(req, res) {
  try {
    // Replace 'someQuery' with the actual query you want to use
    const queryResult = await createTRPCFetch(fetchVideosAndStatsT)("someQuery");

    // Handle the result as needed
    res.status(200).json(queryResult);
  } catch (error) {
    console.error("Error fetching videos and stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

