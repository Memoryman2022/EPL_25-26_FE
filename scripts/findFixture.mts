import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), ".env") });

import clientPromise from "../src/lib/mongodb";

async function findFixture() {
  try {
    const client = await clientPromise;
    const db = client.db("EPL2025");

    // Find Bournemouth vs Nottingham Forest fixture
    const result = await db
      .collection("results")
      .findOne({
        "homeTeam.name": { $regex: /Bournemouth/i },
        "awayTeam.name": { $regex: /Nottingham Forest/i },
      });

    if (result) {
      console.log("\n✅ Found fixture:");
      console.log(`Fixture ID: ${result.fixtureId}`);
      console.log(`Home Team: ${result.homeTeam.name}`);
      console.log(`Away Team: ${result.awayTeam.name}`);
      console.log(`Score: ${result.score?.fullTime?.home || "N/A"} - ${result.score?.fullTime?.away || "N/A"}`);
      console.log(`Winner: ${result.score?.winner || "N/A"}`);
      console.log("\nFull document:");
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log("❌ Fixture not found. Trying reverse (Nottingham Forest vs Bournemouth)...");
      
      const reverseResult = await db
        .collection("results")
        .findOne({
          "homeTeam.name": { $regex: /Nottingham Forest/i },
          "awayTeam.name": { $regex: /Bournemouth/i },
        });

      if (reverseResult) {
        console.log("\n✅ Found fixture (reverse):");
        console.log(`Fixture ID: ${reverseResult.fixtureId}`);
        console.log(`Home Team: ${reverseResult.homeTeam.name}`);
        console.log(`Away Team: ${reverseResult.awayTeam.name}`);
        console.log(`Score: ${reverseResult.score?.fullTime?.home || "N/A"} - ${reverseResult.score?.fullTime?.away || "N/A"}`);
        console.log(`Winner: ${reverseResult.score?.winner || "N/A"}`);
        console.log("\nFull document:");
        console.log(JSON.stringify(reverseResult, null, 2));
      } else {
        console.log("❌ Fixture not found in either direction.");
        console.log("\nSearching for all Bournemouth fixtures...");
        const bournemouthFixtures = await db
          .collection("results")
          .find({
            $or: [
              { "homeTeam.name": { $regex: /Bournemouth/i } },
              { "awayTeam.name": { $regex: /Bournemouth/i } },
            ],
          })
          .toArray();
        
        console.log(`Found ${bournemouthFixtures.length} Bournemouth fixtures:`);
        bournemouthFixtures.forEach((f) => {
          console.log(`  - Fixture ${f.fixtureId}: ${f.homeTeam.name} vs ${f.awayTeam.name}`);
        });
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

findFixture();

