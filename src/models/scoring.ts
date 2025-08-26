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
    totalPoints += 5;

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
      totalPoints += likelihood.points;
      explanation = likelihood.explanation;
    }
  }

  return { totalPoints, outcomeCorrect, scoreCorrect, explanation };
}
