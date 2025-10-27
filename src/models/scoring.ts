import { calculateOutcomeLikelihood } from "../lib/staticTeamRankings.ts";
import { MatchResult, UserPrediction } from "@/models/types.ts";

// Normalize outcome strings from API or DB to internal format
function normalizeOutcome(outcome: string): "homeWin" | "awayWin" | "draw" {
  switch (outcome.toUpperCase()) {
    case "HOME_TEAM":
      return "homeWin";
    case "AWAY_TEAM":
      return "awayWin";
    case "DRAW":
      return "draw";
    case "HOMEWIN": // optional, in case prediction uses camelCase
      return "homeWin";
    case "AWAYWIN":
      return "awayWin";
    case "HOME_WIN": // database format
      return "homeWin";
    case "AWAY_WIN": // database format
      return "awayWin";
    default:
      throw new Error("Unknown outcome: " + outcome);
  }
}

export function calculatePredictionPoints(
  result: MatchResult,
  prediction: UserPrediction
): {
  totalPoints: number;
  outcomeCorrect: boolean;
  scoreCorrect: boolean;
  explanation: string;
} {
  let totalPoints = 0;
  let outcomeCorrect = false;
  let scoreCorrect = false;
  let explanation = "";

  // Normalize outcomes safely
  const actualOutcome = result.score.winner
    ? normalizeOutcome(result.score.winner)
    : null;

  const userOutcome = prediction.outcome
    ? normalizeOutcome(prediction.outcome)
    : null;

  // ✅ Check outcome only if both are non-null
  if (userOutcome && actualOutcome && userOutcome === actualOutcome) {
    outcomeCorrect = true;
    totalPoints = 5; // Base 5 points for correct outcome

    if (
      prediction.homeScore === result.score.fullTime.home &&
      prediction.awayScore === result.score.fullTime.away
    ) {
      scoreCorrect = true;
      const likelihood = calculateOutcomeLikelihood(
        result.homeTeam.name,
        result.awayTeam.name,
        userOutcome,
        prediction.homeScore,
        prediction.awayScore,
        true
      );

      // Apply multiplier to the base 5 points (2x, 3x, 4x, or 5x)
      const multiplier = getMultiplierFromLikelihood(likelihood.likelihood);
      totalPoints = 5 * multiplier;
      explanation = `${likelihood.explanation} (${likelihood.likelihood} - ${multiplier}x multiplier applied to base 5 points)`;
    } else {
      explanation = "Correct outcome predicted (5 points)";
    }
  }

  return { totalPoints, outcomeCorrect, scoreCorrect, explanation };
}

// Helper function to convert likelihood to multiplier
function getMultiplierFromLikelihood(
  likelihood: "likely" | "moderately_likely" | "unlikely" | "very_unlikely"
): number {
  switch (likelihood) {
    case "likely":
      return 2; // 5 * 2 = 10 points
    case "moderately_likely":
      return 3; // 5 * 3 = 15 points
    case "unlikely":
      return 4; // 5 * 4 = 20 points
    case "very_unlikely":
      return 5; // 5 * 5 = 25 points
    default:
      return 2; // Default to 2x
  }
}
