import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// You may want to store your API key securely
const FOOTBALL_API_URL =
  "https://api.football-data.org/v4/competitions/2021/matches?status=FINISHED";
const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json(
      { error: "Access token required" },
      { status: 401 }
    );
  }
  // TODO: Add proper JWT verification and admin check

  try {
    // Use mock data for local testing
    const fs = await import("fs/promises");
    const path = await import("path");
    const mockPath = path.join(
      process.cwd(),
      "src/app/api/results/mockResult.json"
    );
    const mockContent = await fs.readFile(mockPath, "utf-8");
    const mockData = JSON.parse(mockContent);

    const client = await clientPromise;
    const db = client.db("EPL2025");
    let updated = 0;

    for (const match of mockData) {
      // Remove _id and __v if present
      const { _id, __v, ...resultDoc } = match;
      await db
        .collection("results")
        .updateOne(
          { fixtureId: resultDoc.fixtureId },
          { $set: resultDoc },
          { upsert: true }
        );
      updated++;
    }

    return NextResponse.json({ updated });
  } catch (error) {
    console.error("Update results error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
