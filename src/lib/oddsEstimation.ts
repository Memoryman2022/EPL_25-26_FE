import { calculateOutcomeLikelihood } from "./staticTeamRankings";
import { externalToDatabaseName } from "./teamNameMapping";

// Interfaces
interface ScorePrediction {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

/**
 * Calculates the difficulty of a prediction using static team rankings
 */
export function calculatePredictionDifficulty(
  homeScore: number,
  awayScore: number,
  homeTeam: string,
  awayTeam: string
): {
  difficulty: "Easy" | "Medium" | "Hard";
  multiplier: number;
  explanation: string;
} {
  const predictedOutcome =
    homeScore === awayScore
      ? "draw"
      : homeScore > awayScore
        ? "homeWin"
        : "awayWin";

  // Convert team names to database format for ranking lookup
  const homeTeamDB = externalToDatabaseName(homeTeam);
  const awayTeamDB = externalToDatabaseName(awayTeam);

  // Use the static team ranking system
  const result = calculateOutcomeLikelihood(
    homeTeamDB,
    awayTeamDB,
    predictedOutcome,
    homeScore,
    awayScore,
    true
  );
  // Convert likelihood to difficulty for backward compatibility
  let difficulty: "Easy" | "Medium" | "Hard";
  switch (result.likelihood) {
    case "likely":
      difficulty = "Easy";
      break;
    case "moderately_likely":
      difficulty = "Medium";
      break;
    case "unlikely":
      difficulty = "Hard";
      break;
    default:
      difficulty = "Medium";
  }

  return {
    difficulty,
    multiplier: result.points / 5, // Convert points to multiplier (5 base points)
    explanation: result.explanation,
  };
}

/**
 * Converts difficulty to a user-friendly odds display
 */
export function getOddsDisplay(difficulty: string): string {
  switch (difficulty) {
    case "Easy":
      return "2.0"; // 2x multiplier
    case "Medium":
      return "3.0"; // 3x multiplier
    case "Hard":
      return "4.0"; // 4x multiplier
    default:
      return "3.0";
  }
}
