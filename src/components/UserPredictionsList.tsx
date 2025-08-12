"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";

type Prediction = {
  userId: string;
  userName?: string;
  userAvatar?: string;
  homeScore: number;
  awayScore: number;
  outcome: string;
  odds: string;
  points?: number | null;
};

type Props = {
  fixtureId: number; // required now
};

export default function UserPredictionsList({ fixtureId }: Props) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPredictions() {
      setLoading(true);
      try {
        const data = await api.get(`/api/predictions?fixtureId=${fixtureId}`);
        setPredictions(Array.isArray(data.predictions) ? data.predictions : []);
      } catch (error) {
        console.error("Error fetching predictions:", error);
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPredictions();
  }, [fixtureId]);

  if (loading)
    return <p className="text-center mt-4">Loading predictions...</p>;
  if (predictions.length === 0)
    return (
      <p className="text-center mt-4 text-gray-400">No predictions yet.</p>
    );

  return (
    <div className="mt-6 w-full mx-auto space-y-4">
      <h2 className="font-semibold text-center">Predictions</h2>
      <div className="grid grid-cols-1 gap-4">
        {predictions.map((prediction, index) => (
          <div
            key={index}
            className="border w-full rounded-xl p-4 shadow-sm flex items-center justify-between bg-gray-800 text-gray-200"
          >
            {/* User Info */}
            <div className="flex flex-col items-center gap-2">
              {prediction.userAvatar ? (
                <Image
                  src={prediction.userAvatar}
                  alt={prediction.userName || prediction.userId}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-sm text-gray-300">
                  ?
                </div>
              )}
              <p className="font-medium text-sm text-center">
                {prediction.userName || prediction.userId}
              </p>
            </div>

            {/* Score & Outcome */}
            <div className="flex flex-col items-center">
              <p className="text-lg">
                {prediction.homeScore} - {prediction.awayScore}
              </p>
              <p className="text-m text-gray-400">({prediction.outcome})</p>
            </div>

            {/* Odds & Points */}
            <div className="flex flex-col items-end">
              <p className="text-sm text-gray-400">Odds</p>
              <p className="font-semibold text-sm">{prediction.odds}</p>
              <p className="text-sm text-gray-400 mt-1">Points</p>
              <p className="font-semibold text-sm">
                {prediction.points != null ? prediction.points : "--"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
