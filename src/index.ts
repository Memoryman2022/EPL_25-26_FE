import { readFileSync, writeFileSync } from "fs";
import { calculatePredictionPoints } from "./models/scoring.ts";
import { MatchResult, UserPrediction, User } from "./models/types.ts";

const results: MatchResult[] = JSON.parse(
  readFileSync("src/data/results.json", "utf8")
);
const predictions: UserPrediction[] = JSON.parse(
  readFileSync("src/data/predictions.json", "utf8")
);
const users: User[] = JSON.parse(readFileSync("src/data/users.json", "utf8"));

for (const prediction of predictions) {
  const result = results.find((r) => r.fixtureId === prediction.fixtureId);
  if (!result) continue;

  const pointsData = calculatePredictionPoints(result, prediction);
  console.log(`User ${prediction.userId} scored: ${pointsData.totalPoints}`);
  console.log(`Outcome correct: ${pointsData.outcomeCorrect}`);
  console.log(`Score correct: ${pointsData.scoreCorrect}`);
  console.log(`Explanation: ${pointsData.explanation}\n`);

  // Update user object
  const user = users.find((u) => u._id === prediction.userId);
  if (user) {
    user.score += pointsData.totalPoints;
    if (pointsData.outcomeCorrect) user.correctOutcomes += 1;
    if (pointsData.scoreCorrect) user.correctScores += 1;
  }
}

// Write updated users.json
writeFileSync("src/data/users.json", JSON.stringify(users, null, 2));
console.log("Users updated successfully!");
