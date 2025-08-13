"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useDebounce } from "@/app/utils/useDebounce";
import { api } from "@/lib/api";
import {
  calculatePredictionDifficulty,
  getOddsDisplay,
} from "@/lib/oddsEstimation";
import { externalToDatabaseName } from "@/lib/teamNameMapping";

type Prediction = {
  _id?: string;
  fixtureId: number | string;
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
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [odds, setOdds] = useState<string>("N/A");
  const [difficulty, setDifficulty] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [existingPrediction, setExistingPrediction] = useState<Prediction | undefined>();

  const debouncedHomeScore = useDebounce(homeScore, 500);
  const debouncedAwayScore = useDebounce(awayScore, 500);

  // --- Fetch existing prediction (normalize every possible API shape) ---
  useEffect(() => {
    let ignore = false;

    async function fetchExisting() {
      setCheckingExisting(true);
      try {
        // If your api client is Axios-like, this returns { data: ... }
        const res = await api.get(
  `/api/predictions?fixtureId=${fixture.id}&userId=${userId}`
);

        const payload = (res && "data" in res ? res.data : res) as
          | { prediction?: Prediction; predictions?: Prediction[] }
          | Prediction[]
          | Prediction
          | null
          | undefined;

        // Flatten into an array of candidates we can filter
        let candidates: Prediction[] = [];

if (Array.isArray(payload)) {
  candidates = payload;
} else if (payload && typeof payload === "object") {
  if ("predictions" in payload && Array.isArray(payload.predictions)) {
    candidates = payload.predictions;
  } else if ("prediction" in payload && payload.prediction) {
    candidates = [payload.prediction];
  } else {
    candidates = [payload as Prediction];
  }
}


        const match = candidates.find(
          (p) =>
            Number(p.fixtureId) === Number(fixture.id) &&
            String(p.userId) === String(userId)
        );

        if (!ignore) {
          if (match) {
            setExistingPrediction(match);
            // If you want to prefill the form with the previous pick:
            if (typeof match.homeScore === "number") setHomeScore(match.homeScore);
            if (typeof match.awayScore === "number") setAwayScore(match.awayScore);
          } else {
            setExistingPrediction(undefined);
          }
        }
      } catch (err) {
        if (!ignore) console.error("Error fetching existing prediction:", err);
      } finally {
        if (!ignore) setCheckingExisting(false);
      }
    }

    if (fixture?.id && userId) fetchExisting();
    return () => {
      ignore = true;
    };
  }, [fixture?.id, userId]);

  // --- Calculate odds/difficulty whenever scores change ---
  useEffect(() => {
    if (debouncedHomeScore === "" || debouncedAwayScore === "") {
      setOdds("N/A");
      setDifficulty("");
      setExplanation("");
      return;
    }

    try {
      const homeTeamDB = externalToDatabaseName(fixture.homeTeam.name);
      const awayTeamDB = externalToDatabaseName(fixture.awayTeam.name);

      const result = calculatePredictionDifficulty(
        debouncedHomeScore as number,
        debouncedAwayScore as number,
        homeTeamDB,
        awayTeamDB
      );

      setOdds(getOddsDisplay(result.difficulty));
      setDifficulty(result.difficulty);
      setExplanation(result.explanation);
    } catch (error) {
      console.error("Error calculating odds:", error);
      setOdds("N/A");
      setDifficulty("");
      setExplanation("");
    }
  }, [debouncedHomeScore, debouncedAwayScore, fixture.homeTeam.name, fixture.awayTeam.name]);

  // --- Submit the prediction (normalize response on save, too) ---
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
        homeScore > awayScore ? "homeWin" : homeScore < awayScore ? "awayWin" : "draw",
    };

    try {
      const res = existingPrediction
        ? await api.put("/api/predictions", prediction)
        : await api.post("/api/predictions", prediction);

      const payload = (res && "data" in res ? res.data : res) as
        | { prediction?: Prediction }
        | Prediction
        | null
        | undefined;

      const saved = payload && typeof payload === "object" && "prediction" in payload
        ? (payload as any).prediction
        : (payload as Prediction);

      if (saved) setExistingPrediction(saved);
      alert("Prediction saved!");
    } catch (error) {
      console.error(error);
      alert("Failed to save prediction.");
    } finally {
      setSubmitting(false);
    }
  };

  const isLocked = !!existingPrediction;
  const isDisabled = submitting || checkingExisting || isLocked;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm mx-auto">
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center flex-1">
            <input
              type="number"
              id="homeScore"
              className="w-16 bg-gray-800 text-center border rounded p-1"
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value === "" ? "" : Number(e.target.value))}
              disabled={isLocked}
            />
          </div>

          <span className="text-xl font-bold w-12 text-center">:</span>

          <div className="flex flex-col items-center flex-1">
            <input
              type="number"
              id="awayScore"
              className="w-16 bg-gray-800 text-center border rounded p-1"
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value === "" ? "" : Number(e.target.value))}
              disabled={isLocked}
            />
          </div>
        </div>

        {/* Odds display */}
        <div className="text-center space-y-2">
          {homeScore !== "" && awayScore !== "" ? (
            <div>
              <div className="text-sm">
                Difficulty:{" "}
                <span
                  className={`font-semibold ${
                    difficulty === "Easy"
                      ? "text-green-400"
                      : difficulty === "Medium"
                      ? "text-yellow-400"
                      : difficulty === "Hard"
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  {difficulty}
                </span>
              </div>
              <div className="text-xs text-gray-300">
                Odds: <span className="font-semibold">{odds}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">{explanation}</div>
            </div>
          ) : (
            <span className="text-gray-100">Enter a scoreline to see difficulty</span>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isDisabled}
          className="bg-black text-white mt-2 rounded-full disabled:opacity-50 mx-auto block relative w-32 h-10"
        >
          <Image
            src={isLocked || submitting ? "/icons/lock.png" : "/icons/predict.png"}
            alt={isLocked || submitting ? "Locked" : "Predict"}
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </button>
      </form>
    </>
  );
}
