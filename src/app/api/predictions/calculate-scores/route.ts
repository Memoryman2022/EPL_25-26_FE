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

    const userScores: Record<string, number> = {};
    for (const result of results) {
      // Find all predictions for this fixture
      const predictions = await db
        .collection("predictions")
        .find({ fixtureId: result.fixtureId })
        .toArray();
      for (const prediction of predictions) {
        let points = 0;
        // Correct score
        if (
          prediction.homeScore === result.homeScore &&
          prediction.awayScore === result.awayScore
        ) {
          points = 10;
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
        }
        // Update prediction with points and calculated=true
        await db
          .collection("predictions")
          .updateOne(
            { _id: prediction._id },
            { $set: { points, calculated: true } }
          );
        // Track user score
        userScores[prediction.userId] =
          (userScores[prediction.userId] || 0) + points;
        updated++;
      }
    }

    // Update each user's total score
    for (const [userId, score] of Object.entries(userScores)) {
      await db
        .collection("users")
        .updateOne({ _id: new ObjectId(userId) }, { $inc: { score } });
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
