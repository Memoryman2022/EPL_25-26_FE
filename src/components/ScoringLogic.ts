// scoring_component.ts

// To run this file, you can use ts-node: `npx ts-node scoring_component.ts`

import { calculateOutcomeLikelihood } from "@/lib/staticTeamRankings";
import { externalToDatabaseName } from "@/lib/teamNameMapping";

// --- 1. CONFIGURATION AND DATA ---

// Interfaces for type safety
interface ScorePrediction {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

interface BasePoints {
  correctOutcome: number;
}

// The point values for different prediction tiers.
const BASE_POINTS: BasePoints = {
  correctOutcome: 5,
};

// --- 2. HELPER FUNCTIONS ---
// (Helper functions moved to teamGroups.ts)

// --- 3. MAIN SCORING FUNCTION ---

export function calculatePredictionScore(
  prediction: ScorePrediction,
  result: ScorePrediction
): number {
  let totalPoints = 0;

  const predOutcome =
    prediction.homeScore === prediction.awayScore
      ? "draw"
      : prediction.homeScore > prediction.awayScore
      ? "home_win"
      : "away_win";
  const actualOutcome =
    result.homeScore === result.awayScore
      ? "draw"
      : result.homeScore > result.awayScore
      ? "home_win"
      : "away_win";

  if (predOutcome === actualOutcome) {
    // Base points for correct outcome
    totalPoints = BASE_POINTS.correctOutcome;

    // Bonus for exact score using static team ranking system
    if (
      prediction.homeScore === result.homeScore &&
      prediction.awayScore === result.awayScore
    ) {
      // Convert team names to database format for ranking lookup
      const homeTeamDB = externalToDatabaseName(prediction.homeTeam);
      const awayTeamDB = externalToDatabaseName(prediction.awayTeam);

      // Use the static team ranking system
      const likelihoodResult = calculateOutcomeLikelihood(
        homeTeamDB,
        awayTeamDB,
        predOutcome
      );

      totalPoints = likelihoodResult.points;
    }
  }

  return Math.round(totalPoints);
}

// --- 4. EXAMPLE USAGE ---

const myPrediction1: ScorePrediction = {
  homeTeam: "Manchester City",
  awayTeam: "Sunderland",
  homeScore: 3,
  awayScore: 0,
};
const actualResult1: ScorePrediction = {
  homeTeam: "Manchester City",
  awayTeam: "Sunderland",
  homeScore: 3,
  awayScore: 0,
};

const myPrediction2: ScorePrediction = {
  homeTeam: "Burnley",
  awayTeam: "Manchester City",
  homeScore: 2,
  awayScore: 1,
};
const actualResult2: ScorePrediction = {
  homeTeam: "Burnley",
  awayTeam: "Manchester City",
  homeScore: 2,
  awayScore: 1,
};

const myPrediction3: ScorePrediction = {
  homeTeam: "Arsenal",
  awayTeam: "Liverpool",
  homeScore: 2,
  awayScore: 1,
};
const actualResult3: ScorePrediction = {
  homeTeam: "Arsenal",
  awayTeam: "Liverpool",
  homeScore: 3,
  awayScore: 2,
};

console.log("--- Example 1: Common, Expected Result ---");
const score1 = calculatePredictionScore(myPrediction1, actualResult1);
console.log(
  `Prediction: ${myPrediction1.homeTeam} ${myPrediction1.homeScore}-${myPrediction1.awayScore} ${myPrediction1.awayTeam}`
);
console.log(
  `Actual Result: ${actualResult1.homeScore}-${actualResult1.awayScore}`
);
console.log(`Your score: ${score1} points\n`);

console.log("--- Example 2: Unlikely Upset ---");
const score2 = calculatePredictionScore(myPrediction2, actualResult2);
console.log(
  `Prediction: ${myPrediction2.homeTeam} ${myPrediction2.homeScore}-${myPrediction2.awayScore} ${myPrediction2.awayTeam}`
);
console.log(
  `Actual Result: ${actualResult2.homeScore}-${actualResult2.awayScore}`
);
console.log(`Your score: ${score2} points\n`);

console.log("--- Example 3: Correct Outcome, Incorrect Score ---");
const score3 = calculatePredictionScore(myPrediction3, actualResult3);
console.log(
  `Prediction: ${myPrediction3.homeTeam} ${myPrediction3.homeScore}-${myPrediction3.awayScore} ${myPrediction3.awayTeam}`
);
console.log(
  `Actual Result: ${actualResult3.homeScore}-${actualResult3.awayScore}`
);
console.log(`Your score: ${score3} points\n`);
