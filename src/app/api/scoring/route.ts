import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import { calculateOutcomeLikelihood } from "@/lib/staticTeamRankings";
import { externalToDatabaseName } from "@/lib/teamNameMapping";

interface ScorePrediction {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

// Scoring function using static team ranking system
function calculatePredictionScore(
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
    totalPoints = 5;

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

export async function POST(request: Request) {
  try {
    // Check authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Access token required" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fixtureId, homeScore, awayScore, homeTeam, awayTeam } = body;

    if (
      !fixtureId ||
      homeScore === undefined ||
      awayScore === undefined ||
      !homeTeam ||
      !awayTeam
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("EPL2025");

    // Get all predictions for this fixture
    const predictions = await db
      .collection("predictions")
      .find({ fixtureId })
      .toArray();

    const actualResult: ScorePrediction = {
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
    };

    // Calculate scores for all predictions
    const updatedPredictions = [];
    for (const prediction of predictions) {
      const predictionData: ScorePrediction = {
        homeTeam: prediction.homeTeam || homeTeam,
        awayTeam: prediction.awayTeam || awayTeam,
        homeScore: prediction.homeScore,
        awayScore: prediction.awayScore,
      };

      const score = calculatePredictionScore(predictionData, actualResult);

      // Update prediction with score
      const updatedPrediction = await db
        .collection("predictions")
        .findOneAndUpdate(
          { _id: prediction._id },
          {
            $set: {
              calculated: true,
              points: score,
              actualResult: actualResult,
            },
          },
          { returnDocument: "after" }
        );

      updatedPredictions.push(updatedPrediction.value);

      // Update user's total score
      await db.collection("users").updateOne(
        { _id: prediction.userId },
        {
          $inc: {
            score: score,
            correctScores:
              prediction.homeScore === homeScore &&
              prediction.awayScore === awayScore
                ? 1
                : 0,
            correctOutcomes:
              (prediction.homeScore === prediction.awayScore) ===
              (homeScore === awayScore)
                ? 1
                : 0,
          },
        }
      );
    }

    return NextResponse.json({
      message: "Scores calculated successfully",
      predictions: updatedPredictions,
    });
  } catch (error) {
    console.error("Error calculating scores:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
