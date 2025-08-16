// scoring_matrix.ts

// To run this file, you can use ts-node: `npx ts-node scoring_matrix.ts`

import * as math from "mathjs";

// --- 1. CONFIGURATION AND DATA ---

// Interfaces for type safety
interface TeamRanks {
  [teamName: string]: number;
}

interface ScorePrediction {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

interface BasePoints {
  correctOutcome: number;
  correctGoalDifference: number;
  exactScoreBonus: number;
}

interface MultiplierConfig {
  [category: string]: number;
}

// Your initial ranking based on pre-season odds.
const TEAM_RANKS_PRE_SEASON: TeamRanks = {
  "Liverpool FC": 1,
  "Arsenal FC": 2,
  "Manchester City FC": 3,
  "Chelsea FC": 4,
  "Manchester United FC": 5,
  "Tottenham Hotspur FC": 6,
  "Newcastle United FC": 7,
  "Aston Villa FC": 8,
  "Crystal Palace FC": 9,
  "Brighton & Hove Albion FC": 10,
  "West Ham United FC": 11,
  "Brentford FC": 12,
  "Fulham FC": 13,
  "Nottingham Forest FC": 14,
  "Wolverhampton Wanderers FC": 15,
  "Everton FC": 16,
  "AFC Bournemouth": 17,
  "Leeds United FC": 18,
  "Burnley FC": 19,
  "Sunderland AFC": 20,
};

export function calculateFixtureOdds(
  homeTeam: string,
  awayTeam: string,
  teamRanks: TeamRanks = TEAM_RANKS_PRE_SEASON
) {
  const homeRank = teamRanks[homeTeam] || 20;
  const awayRank = teamRanks[awayTeam] || 20;
  // Lower rank means stronger team
  const rankDiff = awayRank - homeRank;

  // Base probabilities
  let homeWinProb = 0.33;
  let drawProb = 0.25;
  let awayWinProb = 0.33;

  // Adjust based on rank difference
  if (rankDiff > 0) {
    // Home team is stronger
    homeWinProb += Math.min(0.15, rankDiff * 0.01);
    awayWinProb -= Math.min(0.15, rankDiff * 0.01);
  } else if (rankDiff < 0) {
    // Away team is stronger
    awayWinProb += Math.min(0.15, -rankDiff * 0.01);
    homeWinProb -= Math.min(0.15, -rankDiff * 0.01);
  }

  // Normalize so total probability is <= 1
  const total = homeWinProb + drawProb + awayWinProb;
  homeWinProb /= total;
  drawProb /= total;
  awayWinProb /= total;

  // Convert to decimal odds
  const homeWinOdds = +(1 / homeWinProb).toFixed(2);
  const drawOdds = +(1 / drawProb).toFixed(2);
  const awayWinOdds = +(1 / awayWinProb).toFixed(2);

  return {
    homeWinOdds,
    drawOdds,
    awayWinOdds,
    homeWinProb: +(homeWinProb * 100).toFixed(1),
    drawProb: +(drawProb * 100).toFixed(1),
    awayWinProb: +(awayWinProb * 100).toFixed(1),
  };
}

// The point values for different prediction tiers.
const BASE_POINTS: BasePoints = {
  correctOutcome: 5,
  correctGoalDifference: 15,
  exactScoreBonus: 30, // This is the value that will be multiplied
};

// Multipliers for scoreline rarity. You can tune these values.
const SCORELINE_RARITY_MULTIPLIERS: MultiplierConfig = {
  very_common: 1.0, // e.g., 1-0, 1-1, 2-1
  common: 1.5, // e.g., 2-0, 2-2
  less_common: 2.5, // e.g., 3-0, 3-2, 0-0
  rare: 4.0, // e.g., 4-1, 3-3
  very_rare: 6.0, // e.g., 5-0, 4-3, etc.
};

// --- 2. HELPER FUNCTIONS ---

function getScorelineCategory(score1: number, score2: number): string {
  /** Categorizes a scoreline based on its rarity. */
  const diff = Math.abs(score1 - score2);
  const totalGoals = score1 + score2;

  if (totalGoals <= 3) {
    if (diff === 0) {
      // 0-0, 1-1
      return "less_common";
    } else {
      // 1-0, 2-0, 2-1
      return "very_common";
    }
  } else if (totalGoals === 4) {
    // 2-2, 3-1
    if (diff === 0) {
      return "common";
    } else {
      return "common";
    }
  } else if (totalGoals >= 5) {
    if (diff <= 1) {
      // 3-2, 4-3
      return "rare";
    } else {
      return "very_rare";
    }
  }
  return "very_rare"; // Default for all other high-scoring games
}

function getRankDifferenceModifier(
  homeRank: number,
  awayRank: number,
  predictedOutcome: string
): number {
  /**
   * Calculates a multiplier based on the difference in team ranks and the
   * predicted outcome (upset vs. expected win).
   * * A higher modifier rewards more surprising results.
   */
  const rankDiff = Math.abs(homeRank - awayRank);

  // Base modifier is 1.0, adjusted by rank_diff.
  // We use a logarithmic scale to not over-reward huge differences
  // and to make the penalty for expecting a top team to win less severe.
  const diffModifier =
    1.0 + (math.log10(Math.max(1, rankDiff)) as number) * 0.5;

  let isUpset = false;
  let isExpectedWin = false;

  if (predictedOutcome === "home_win") {
    if (homeRank > awayRank) {
      // Weaker home team wins = Upset
      isUpset = true;
    } else {
      isExpectedWin = true;
    }
  } else if (predictedOutcome === "away_win") {
    if (awayRank > homeRank) {
      // Weaker away team wins = Upset
      isUpset = true;
    } else {
      isExpectedWin = true;
    }
  }

  if (isUpset) {
    return diffModifier * 2.5; // High reward for an upset
  } else if (predictedOutcome === "draw" && rankDiff > 5) {
    return diffModifier * 2.0; // Good reward for a draw between unequal teams
  } else if (predictedOutcome === "draw") {
    return diffModifier * 1.2; // Moderate reward for a draw between equals
  } else if (isExpectedWin) {
    return Math.max(1.0, 2.0 / diffModifier); // Penalize predicting the obvious
  }

  return 1.0; // Default for other cases
}

// --- 3. MAIN SCORING FUNCTION ---

function calculatePredictionScore(
  prediction: ScorePrediction,
  result: ScorePrediction,
  teamRanks: TeamRanks
): number {
  /**
   * Calculates the score for a single prediction against a real result.
   */
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

  // Step 1: Check for correct outcome (W/D/L)
  if (predOutcome === actualOutcome) {
    totalPoints += BASE_POINTS.correctOutcome;

    // Step 2: Check for correct goal difference
    const predDiff = prediction.homeScore - prediction.awayScore;
    const actualDiff = result.homeScore - result.awayScore;

    if (predDiff === actualDiff) {
      // Step 3: Check for correct exact score (this is where multipliers are applied)
      if (
        prediction.homeScore === result.homeScore &&
        prediction.awayScore === result.awayScore
      ) {
        // Get multiplier for scoreline rarity
        const scorelineCategory = getScorelineCategory(
          prediction.homeScore,
          prediction.awayScore
        );
        const scorelineMultiplier =
          SCORELINE_RARITY_MULTIPLIERS[scorelineCategory] || 1.0;

        // Get multiplier for team strength difference
        const homeRank = teamRanks[prediction.homeTeam] || 20; // Default to lowest rank
        const awayRank = teamRanks[prediction.awayTeam] || 20;
        const rankModifier = getRankDifferenceModifier(
          homeRank,
          awayRank,
          predOutcome
        );

        // Combine multipliers
        const unlikelinessMultiplier = scorelineMultiplier * rankModifier;

        // Apply the multiplied bonus
        const exactScoreBonus =
          BASE_POINTS.exactScoreBonus * unlikelinessMultiplier;
        totalPoints += exactScoreBonus;
      } else {
        // If goal difference is correct but exact score is not, award the GD points
        totalPoints += BASE_POINTS.correctGoalDifference;
      }
    }
  }

  return Math.round(totalPoints);
}

// --- 4. EXAMPLE USAGE ---

// You can use these example predictions and results to test the function.
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
const score1 = calculatePredictionScore(
  myPrediction1,
  actualResult1,
  TEAM_RANKS_PRE_SEASON
);
console.log(
  `Prediction: ${myPrediction1.homeTeam} ${myPrediction1.homeScore}-${myPrediction1.awayScore} ${myPrediction1.awayTeam}`
);
console.log(
  `Actual Result: ${actualResult1.homeScore}-${actualResult1.awayScore}`
);
console.log(`Your score: ${score1} points\n`);

console.log("--- Example 2: Unlikely Upset ---");
const score2 = calculatePredictionScore(
  myPrediction2,
  actualResult2,
  TEAM_RANKS_PRE_SEASON
);
console.log(
  `Prediction: ${myPrediction2.homeTeam} ${myPrediction2.homeScore}-${myPrediction2.awayScore} ${myPrediction2.awayTeam}`
);
console.log(
  `Actual Result: ${actualResult2.homeScore}-${actualResult2.awayScore}`
);
console.log(`Your score: ${score2} points\n`);

console.log("--- Example 3: Correct Goal Difference, Incorrect Score ---");
const score3 = calculatePredictionScore(
  myPrediction3,
  actualResult3,
  TEAM_RANKS_PRE_SEASON
);
console.log(
  `Prediction: ${myPrediction3.homeTeam} ${myPrediction3.homeScore}-${myPrediction3.awayScore} ${myPrediction3.awayTeam}`
);
console.log(
  `Actual Result: ${actualResult3.homeScore}-${actualResult3.awayScore}`
);
console.log(`Your score: ${score3} points\n`);
