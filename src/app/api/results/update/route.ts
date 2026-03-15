import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

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

  try {
    console.log("Fetching finished matches from Football API...");

    const response = await fetch(FOOTBALL_API_URL, {
      headers: {
        "X-Auth-Token": API_KEY || "",
      },
    });

    if (!response.ok) {
      throw new Error(`Football API error: ${response.status}`);
    }

    const apiData = await response.json();
    const matches = apiData.matches || [];

    console.log(`API returned ${matches.length} matches`);

    if (!matches.length) {
      return NextResponse.json({
        updated: 0,
        message: "No matches returned from API",
      });
    }

    const client = await clientPromise;
    const db = client.db("EPL2025");
    const resultsCollection = db.collection("results");

    let updated = 0;

    for (const match of matches) {
      const resultDoc = {
        fixtureId: match.id,
        utcDate: match.utcDate,
        status: match.status,
        matchday: match.matchday,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        score: match.score,
        lastUpdated: new Date(),
      };

      console.log(`Updating match ${match.id}`);

      await resultsCollection.updateOne(
        { fixtureId: match.id },
        { $set: resultDoc },
        { upsert: true }
      );

      updated++;
    }

    console.log(`Total matches updated: ${updated}`);

    return NextResponse.json({
      updated,
    });
  } catch (error) {
    console.error("Update results error:", error);

    return NextResponse.json(
      { error: "Failed to update results" },
      { status: 500 }
    );
  }
}