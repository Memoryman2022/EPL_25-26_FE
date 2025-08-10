"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
  fixtureId?: number; // optional
  userId?: string; // optional — if you want to fetch for any user
};

export default function UserPredictionsList({ fixtureId, userId }: Props) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPredictions() {
      setLoading(true);
      try {
        let query = [];
        if (fixtureId) query.push(`fixtureId=${fixtureId}`);

        // For the logged-in user, no userId query needed, API gets userId from token
        // For others, userId query can be appended (if allowed by API)
        if (userId) query.push(`userId=${userId}`);
        const queryString = query.length ? `?${query.join("&")}` : "";

        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token");

        const res = await fetch(`/api/predictions${queryString}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.predictions)) {
            setPredictions(data.predictions);
          } else {
            setPredictions([]);
          }
        } else {
          setPredictions([]);
          console.error("Failed to fetch predictions:", await res.text());
        }
      } catch (err) {
        console.error("Error fetching predictions:", err);
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    }

    if (fixtureId || userId) {
      fetchPredictions();
    }
  }, [fixtureId, userId]);

  if (loading) return <p className="text-center mt-4">Loading predictions...</p>;
  if (!predictions.length)
    return <p className="text-center mt-4 text-gray-400">No predictions yet.</p>;

  return (
    <div className="mt-6 w-full mx-auto space-y-4">
      <h2 className="font-semibold text-center">Predictions</h2>
      <div className="grid grid-cols-1 gap-4">
        {predictions.map((prediction, index) => (
          <div
            key={index}
            className="border w-full rounded-xl p-4 shadow-sm flex items-center justify-between bg-gray-800 text-gray-200"
          >
            {/* User Info Section */}
            <div className="flex flex-col items-center gap-2">
              {prediction.userAvatar ? (
                <Image
                  src={prediction.userAvatar}
                  alt={`${prediction.userName || prediction.userId}`}
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

            {/* Score and Outcome Section */}
            <div className="flex flex-col items-center">
              <p className="text-lg">
                {prediction.homeScore} - {prediction.awayScore}
              </p>
              <p className="text-m text-gray-400">({prediction.outcome})</p>
            </div>

            {/* Odds & Points Section */}
            <div className="flex flex-col items-end">
              <p className="text-sm text-gray-400">Odds</p>
              <p className="font-semibold text-sm">{prediction.odds}</p>
              <p className="text-sm text-gray-400 mt-1">Points</p>
              <p className="font-semibold text-sm">
                {prediction.points !== undefined && prediction.points !== null
                  ? prediction.points
                  : "--"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
