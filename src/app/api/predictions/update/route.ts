// src/app/api/predictions/update/route.ts
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { calculatePredictionPoints } from "@/models/scoring";
import { ObjectId } from "mongodb";
import { MatchResult, UserPrediction } from "@/models/types";

export async function POST(req: Request) {
  try {
    console.log("Received POST request to /api/predictions/update");

    const client = await clientPromise;
    const db = client.db("EPL2025");
    console.log("Connected to MongoDB");

    // 1. Get all fixtureIds from results
    const results = await db
      .collection<MatchResult>("results")
      .find({})
      .toArray();

    const fixtureIds = results.map((r) => r.fixtureId);
    console.log("Fixture IDs to process:", fixtureIds);

    // 2. Get all uncalculated predictions for these fixtureIds
    const predictions = await db
      .collection<UserPrediction>("predictions")
      .find({ fixtureId: { $in: fixtureIds }, calculated: false })
      .toArray();

    console.log(`Total uncalculated predictions found: ${predictions.length}`);
    if (predictions.length === 0) {
      return NextResponse.json({ updated: 0 });
    }

    // 3. Group results by fixtureId for quick lookup
    const resultsById = new Map<number, MatchResult>();
    for (const result of results) {
      resultsById.set(result.fixtureId, result);
    }

    let updatedCount = 0;

    // 4. Process predictions
    for (const pred of predictions) {
      const resultDoc = resultsById.get(pred.fixtureId);
      if (!resultDoc) {
        console.log(
          `No result found for fixtureId ${pred.fixtureId}, skipping`
        );
        continue;
      }

      const pointsData = calculatePredictionPoints(resultDoc, pred);

      // Update user stats
      await db.collection("users").updateOne(
        { _id: new ObjectId(pred.userId) },
        {
          $inc: {
            score: pointsData.totalPoints,
            correctScores: pointsData.scoreCorrect ? 1 : 0,
            correctOutcomes: pointsData.outcomeCorrect ? 1 : 0,
          },
        }
      );

      // Mark prediction as calculated
      await db.collection("predictions").updateOne(
        { _id: pred._id },
        {
          $set: {
            points: pointsData.totalPoints,
            scoreCorrect: pointsData.scoreCorrect,
            outcomeCorrect: pointsData.outcomeCorrect,
            calculated: true,
            updatedAt: new Date(),
            explanation: pointsData.explanation,
          },
        }
      );

      updatedCount++;
    }

    console.log(`Total predictions updated: ${updatedCount}`);
    return NextResponse.json({ updated: updatedCount });
  } catch (err: any) {
    console.error("Error updating predictions:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
