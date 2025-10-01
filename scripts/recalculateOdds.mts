import { config } from "dotenv";
config({ path: ".env" }); // load environment variables

// Dynamically import modules that depend on process.env
const { default: clientPromise } = await import("../src/lib/mongodb");
const { calculatePredictionDifficulty, getOddsDisplay } = await import(
  "../src/lib/oddsEstimation"
);

async function main() {
  const client = await clientPromise;
  const db = client.db("EPL2025");

  const predictions = await db.collection("predictions").find({}).toArray();
  const fixtures = await db.collection("results").find({}).toArray();

  let updatedCount = 0;

  for (const prediction of predictions) {
    const fixture = fixtures.find((f) => f.fixtureId === prediction.fixtureId);
    if (!fixture) continue;
    const gameweek = fixture.gameweek;
    if (gameweek < 1 || gameweek > 5) continue;

    const difficultyResult = calculatePredictionDifficulty(
      prediction.homeScore,
      prediction.awayScore,
      fixture.homeTeam.name,
      fixture.awayTeam.name
    );
    const odds = getOddsDisplay(difficultyResult.difficulty);

    await db
      .collection("predictions")
      .updateOne({ _id: prediction._id }, { $set: { odds } });
    updatedCount++;
  }

  console.log(
    `✅ Recalculated odds for ${updatedCount} predictions in gameweeks 1-5.`
  );
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Error recalculating odds:", err);
  process.exit(1);
});
