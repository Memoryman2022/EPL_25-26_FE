// scripts/resetPredictions.mts
import clientPromise from "../../lib/mongodb.ts";

export async function resetAllPredictions() {
  try {
    const client = await clientPromise;
    const db = client.db("EPL2025");

    const updateResult = await db.collection("predictions").updateMany(
      {}, // match all predictions
      {
        $set: {
          points: 0,
          calculated: false,
          outcomeCorrect: false,
          scoreCorrect: false,
        },
      }
    );

    console.log(`🔄 Reset ${updateResult.modifiedCount} predictions.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting predictions:", error);
    process.exit(1);
  }
}

resetAllPredictions();
