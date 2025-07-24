'use client';

import { useState, useEffect } from "react";

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
  const [existingPrediction, setExistingPrediction] = useState<Prediction | undefined>();

  useEffect(() => {
    async function fetchPrediction() {
      const res = await fetch(`/api/predictions?fixtureId=${fixture.id}&userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setExistingPrediction(data.prediction || undefined);
      }
    }
    fetchPrediction();
  }, [fixture.id, userId]);

  const handlePredictionSuccess = (prediction: Prediction) => {
    setExistingPrediction(prediction);
    alert("Prediction saved!");
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">
        {fixture.homeTeam.name} vs {fixture.awayTeam.name}
      </h2>
      <p className="text-gray-600 mb-4">Date: {fixture.utcDate}</p>
    </div>
  );
}
