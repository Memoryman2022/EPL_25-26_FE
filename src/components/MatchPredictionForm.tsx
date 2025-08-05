"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Prediction = {
  _id?: string;
  fixtureId: number;
  userId: string;
  homeScore: number | "";
  awayScore: number | "";
  outcome: "homeWin" | "draw" | "awayWin" | "";
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
  const [existingPrediction, setExistingPrediction] = useState<Prediction | undefined>();

  useEffect(() => {
    async function fetchPrediction() {
      const res = await fetch(`/api/predictions?fixtureId=${fixture.id}&userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setExistingPrediction(data.prediction || undefined);
        if (data.prediction) {
          setHomeScore(data.prediction.homeScore);
          setAwayScore(data.prediction.awayScore);
        }
      }
    }
    fetchPrediction();
  }, [fixture.id, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (homeScore === "" || awayScore === "") return;

    setSubmitting(true);

    const prediction: Prediction = {
      fixtureId: fixture.id,
      userId,
      homeScore,
      awayScore,
      outcome:
        homeScore > awayScore
          ? "homeWin"
          : homeScore < awayScore
          ? "awayWin"
          : "draw",
    };

    const res = await fetch("/api/predictions", {
      method: existingPrediction ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prediction),
    });

    if (res.ok) {
      const saved = await res.json();
      setExistingPrediction(saved);
      alert("Prediction saved!");
    } else {
      alert("Failed to save prediction.");
    }

    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-center gap-6">
        <div className="flex flex-col items-center flex-1">
          <input
            type="number"
            id="homeScore"
            className="w-16 text-center border rounded p-1"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>

        <span className="text-xl font-bold w-12 text-center">:</span>

        <div className="flex flex-col items-center flex-1">
          <input
            type="number"
            id="awayScore"
            className="w-16 text-center border rounded p-1"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-black text-white mt-4  rounded-full disabled:opacity-50 mx-auto block relative w-32 h-10"
      >
        {submitting || existingPrediction ? (
          <Image
            src="/icons/lock.png"
            alt="Locked"
            fill
            style={{ objectFit: "contain" }}
          />
        ) : (
          <Image
            src="/icons/predict.png"
            alt="Predict"
            fill
            style={{ objectFit: "contain" }}
          />
        )}
      </button>
    </form>
  );
}
