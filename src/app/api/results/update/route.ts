import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

// Minimal typings for API response (only fields we care about)
interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

interface Score {
  winner: string | null;
  duration: string;
  fullTime: { home: number; away: number };
  halfTime: { home: number; away: number };
}

interface Match {
  id: number;
  utcDate: string;
  status: string;
  matchday: number | null;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
}

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

    const response = await fetch(
      "https://api.football-data.org/v4/competitions/2021/matches?status=FINISHED",
      {
        headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY || "" },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Football API fetch failed:", response.status, text);
      throw new Error(`Football API error: ${response.status}`);
    }

    const apiData: { matches: Match[] } = await response.json();
    const matches: Match[] = apiData.matches || [];

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

    // Prepare bulk update operations
    const bulkOps = matches.map((match: Match) => ({
      updateOne: {
        filter: { fixtureId: match.id },
        update: {
          $set: {
            fixtureId: match.id,
            utcDate: match.utcDate,
            status: match.status,
            matchday: match.matchday,
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            score: match.score,
            lastUpdated: new Date(),
          },
        },
        upsert: true,
      },
    }));

    const bulkResult = await resultsCollection.bulkWrite(bulkOps);

    console.log(
      `Bulk update completed: matched ${bulkResult.matchedCount}, modified ${bulkResult.modifiedCount}, upserted ${bulkResult.upsertedCount}`
    );

    return NextResponse.json({
      updated: bulkResult.upsertedCount + bulkResult.modifiedCount,
    });
  } catch (error: unknown) {
    console.error("Update results error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to update results";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}