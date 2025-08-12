"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import UserPredictionsList from "@/components/UserPredictionsList";
import { useDebounce } from "@/app/utils/useDebounce"; // Ensure this path is correct
import { api } from "@/lib/api";
import { calculateFixtureOdds } from "@/app/utils/scoring_matrix";

type Prediction = {
  _id?: string;
  fixtureId: number;
  userId: string;
  homeScore: number | "";
  awayScore: number | "";
  outcome: "homeWin" | "draw" | "awayWin" | "";
  odds?: string;
  calculated?: boolean;
  updatedAt?: string;
};

type Team = { id: number; name: string };
type Fixture = {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  utcDate: string;
  utcTime?: string;
};

type Props = {
  fixture: Fixture;
  userId: string;
};

export default function MatchPredictionForm({ fixture, userId }: Props) {
  const [homeScore, setHomeScore] = useState<number | "">("");
  const [awayScore, setAwayScore] = useState<number | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [odds, setOdds] = useState<string>("N/A");
  const [existingPrediction, setExistingPrediction] = useState<
    Prediction | undefined
  >();

  // Use the debounce hooks for home and away scores
  const debouncedHomeScore = useDebounce(homeScore, 500); // 500ms delay
  const debouncedAwayScore = useDebounce(awayScore, 500); // 500ms delay

  // Fetch existing prediction if it exists
  useEffect(() => {
    async function fetchPrediction() {
      try {
        const data = await api.get(`/api/predictions?fixtureId=${fixture.id}`);
        setExistingPrediction(data.prediction || undefined);
        if (data.prediction) {
          setHomeScore(data.prediction.homeScore);
          setAwayScore(data.prediction.awayScore);
        }
      } catch (error) {
        console.error("Error fetching prediction:", error);
      }
    }
    fetchPrediction();
  }, [fixture.id, userId]);

  // Calculate odds using scoring_matrix.ts
  useEffect(() => {
    if (fixture.homeTeam.name && fixture.awayTeam.name) {
      const oddsObj = calculateFixtureOdds(
        fixture.homeTeam.name,
        fixture.awayTeam.name
      );
      setOdds(
        `Home: ${oddsObj.homeWinOdds} | Draw: ${oddsObj.drawOdds} | Away: ${oddsObj.awayWinOdds}`
      );
    } else {
      setOdds("N/A");
    }
  }, [fixture.homeTeam.name, fixture.awayTeam.name]);

  // Submit the prediction
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (homeScore === "" || awayScore === "") return;

    setSubmitting(true);

    const prediction: Prediction = {
      fixtureId: fixture.id,
      userId,
      homeScore,
      awayScore,
      odds,
      outcome:
        homeScore > awayScore
          ? "homeWin"
          : homeScore < awayScore
          ? "awayWin"
          : "draw",
    };

    try {
      const saved = existingPrediction
        ? await api.put("/api/predictions", prediction)
        : await api.post("/api/predictions", prediction);

      setExistingPrediction(saved);
      // IMPORTANT: Replace alert() with a custom modal or toast notification
      alert("Prediction saved!");
    } catch (error) {
      // IMPORTANT: Replace alert() with a custom modal or toast notification
      alert("Failed to save prediction.");
    }

    setSubmitting(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-sm mx-auto"
      >
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center flex-1">
            <input
              type="number"
              id="homeScore"
              className="w-16 bg-gray-800 text-center border rounded p-1"
              value={homeScore}
              onChange={(e) =>
                setHomeScore(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </div>

          <span className="text-xl font-bold w-12 text-center">:</span>

          <div className="flex flex-col items-center flex-1">
            <input
              type="number"
              id="awayScore"
              className="w-16 bg-gray-800 text-center border rounded p-1"
              value={awayScore}
              onChange={(e) =>
                setAwayScore(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </div>
        </div>

        {/* Odds display */}
        <div className="text-center text-m ">
          {homeScore !== "" && awayScore !== "" ? (
            <span>
              Predicted odds: <span className="font-semibold">{odds}</span>
            </span>
          ) : (
            <span className="text-gray-100">Enter a scoreline to see odds</span>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white mt-2 rounded-full disabled:opacity-50 mx-auto block relative w-32 h-10"
        >
          <Image
            src={
              submitting || existingPrediction
                ? "/icons/lock.png"
                : "/icons/predict.png"
            }
            alt={submitting || existingPrediction ? "Locked" : "Predict"}
            fill
            style={{ objectFit: "contain" }}
          />
        </button>
      </form>

      {/* Always render other users' predictions for testing/styling */}
      {/* <UserPredictionsList mode="fixture" fixtureId={fixture.id} /> */}
    </>
  );
}
