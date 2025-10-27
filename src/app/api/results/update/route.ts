import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const FOOTBALL_API_URL =
  "https://api.football-data.org/v4/competitions/2021/matches?status=FINISHED&limit=1000";
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
    // Fetch live data from the Football API with high limit to get all results
    const response = await fetch(FOOTBALL_API_URL, {
      headers: {
        "X-Auth-Token": API_KEY || "",
      },
    });

    if (!response.ok) {
      throw new Error(`Football API error: ${response.statusText}`);
    }

    const apiData = await response.json();
    const matches = apiData.matches || [];

    console.log(`API returned ${matches.length} matches`);

    const client = await clientPromise;
    const db = client.db("EPL2025");
    let updated = 0;

    for (const match of matches) {
      const { _id, __v, ...resultDoc } = match;
      console.log(`Processing match ID: ${resultDoc.id}`);
      await db.collection("results").updateOne(
        { fixtureId: resultDoc.id }, // Assuming `id` is the fixtureId equivalent
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
