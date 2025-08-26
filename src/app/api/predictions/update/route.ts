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

    // 1. Fetch all fixture IDs from results
    const allResults = await db
      .collection<MatchResult>("results")
      .find({})
      .project({ fixtureId: 1 })
      .toArray();

    const fixtureIds = allResults.map((r) => r.fixtureId);
    console.log("Fixture IDs to process:", fixtureIds);

    let totalUpdated = 0;

    // 2. For each fixtureId, fetch predictions and update
    for (const fixtureId of fixtureIds) {
      const predictions = await db
        .collection<UserPrediction>("predictions")
        .find({ fixtureId, calculated: false })
        .toArray();

      console.log(
        `Fixture ${fixtureId} has ${predictions.length} predictions to process`
      );

      if (predictions.length === 0) continue;

      const resultDoc = await db
        .collection<MatchResult>("results")
        .findOne({ fixtureId });
      if (!resultDoc) {
        console.log(`No match result found for fixtureId: ${fixtureId}`);
        continue;
      }

      for (const pred of predictions) {
        const pointsData = calculatePredictionPoints(resultDoc, pred);

        // Update user score
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

        totalUpdated++;
      }
    }

    console.log(`Total predictions updated: ${totalUpdated}`);
    return NextResponse.json({ updated: totalUpdated });
  } catch (err: any) {
    console.error("Error updating predictions:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
