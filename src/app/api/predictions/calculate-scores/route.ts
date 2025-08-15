import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  // Only allow admin users (add your auth logic as needed)
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json(
      { error: "Access token required" },
      { status: 401 }
    );
  }
  // TODO: Add proper JWT verification and admin check

  try {
    const client = await clientPromise;
    const db = client.db("EPL2025");

    // Get all finished results
    const results = await db.collection("results").find({}).toArray();
    let updated = 0;

    // Track per-user stats
    const userStats: Record<
      string,
      { score: number; correctScores: number; correctOutcomes: number }
    > = {};

    for (const result of results) {
      // Find all predictions for this fixture
      const predictions = await db
        .collection("predictions")
        .find({ fixtureId: result.fixtureId })
        .toArray();

      for (const prediction of predictions) {
        let points = 0;
        let correctScore = 0;
        let correctOutcome = 0;

        // Correct score
        if (
          prediction.homeScore === result.homeScore &&
          prediction.awayScore === result.awayScore
        ) {
          points = 10;
          correctScore = 1;
        } else if (
          // Correct outcome
          (prediction.homeScore > prediction.awayScore &&
            result.homeScore > result.awayScore) ||
          (prediction.homeScore < prediction.awayScore &&
            result.homeScore < result.awayScore) ||
          (prediction.homeScore === prediction.awayScore &&
            result.homeScore === result.awayScore)
        ) {
          points = 5;
          correctOutcome = 1;
        }

        // Update prediction with points and calculated=true
        await db.collection("predictions").updateOne(
          { _id: prediction._id },
          { $set: { points, calculated: true } }
        );

        // Initialize user stats if not exist
        if (!userStats[prediction.userId]) {
          userStats[prediction.userId] = {
            score: 0,
            correctScores: 0,
            correctOutcomes: 0,
          };
        }

        // Accumulate user stats
        userStats[prediction.userId].score += points;
        userStats[prediction.userId].correctScores += correctScore;
        userStats[prediction.userId].correctOutcomes += correctOutcome;

        updated++;
      }
    }

    // Update each user's totals in the DB
    for (const [userId, stats] of Object.entries(userStats)) {
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        {
          $inc: {
            score: stats.score,
            correctScores: stats.correctScores,
            correctOutcomes: stats.correctOutcomes,
          },
        }
      );
    }

    return NextResponse.json({ updated });
  } catch (error) {
    console.error("Calculate scores error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
