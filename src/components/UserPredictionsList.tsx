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
  fixtureId: number;
};

// Temporary mock data for testing purposes
const mockPredictions: Prediction[] = [
  {
    userId: "user123",
    userName: "Alice",
    userAvatar: "https://placehold.co/40x40/FF5733/FFFFFF?text=A", // Placeholder for avatar
    homeScore: 2,
    awayScore: 1,
    outcome: "homeWin",
    odds: "1.50",
    points: 3,
  },
  {
    userId: "user456",
    userName: "Bob",
    userAvatar: "https://placehold.co/40x40/3366FF/FFFFFF?text=B", // Placeholder for avatar
    homeScore: 0,
    awayScore: 0,
    outcome: "draw",
    odds: "3.20",
    points: null, // Points not yet calculated
  },
  {
    userId: "user789",
    userName: "Charlie",
    userAvatar: "https://placehold.co/40x40/33FF57/FFFFFF?text=C", // Placeholder for avatar
    homeScore: 1,
    awayScore: 3,
    outcome: "awayWin",
    odds: "4.00",
    points: 0, // Example: incorrect prediction
  },
];

export default function UserPredictionsList({ fixtureId }: Props) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPredictions() {
      // --- START: Temporary Test Logic ---
      if (fixtureId === 999) {
        // Use a dummy fixtureId like 999 for testing mock data
        console.log("Using mock data for fixtureId 999");
        setPredictions(mockPredictions);
        setLoading(false);
        return;
      }
      // --- END: Temporary Test Logic ---

      try {
        console.log(`Fetching predictions for fixtureId: ${fixtureId}`);
        const res = await fetch(`/api/predictions/fixture/${fixtureId}`);
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched predictions:", data.predictions);
          setPredictions(data.predictions);
        } else {
          console.error(
            "Failed to fetch predictions",
            res.status,
            await res.text()
          );
        }
      } catch (err) {
        console.error("Error fetching predictions:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPredictions();
  }, [fixtureId]);

  if (loading)
    return <p className="text-center mt-4">Loading predictions...</p>;

  return (
    <div className="mt-6 w-full mx-auto space-y-4"> {/* Added mx-auto for centering */}
      <h2 className="font-semibold text-center">Predictions</h2>
      <div className="grid grid-cols-1 gap-4">
        {predictions.map((prediction, index) => (
          <div
  key={index}
  className="border w-full  rounded-xl p-4 shadow-sm flex items-center justify-between bg-gray-800 text-gray-200"
>
            {/* User Info Section: Vertically aligned profile pic and name */}
            <div className="flex flex-col items-center gap-2"> {/* Changed to flex-col and added gap */}
              {prediction.userAvatar ? (
                <Image
                  src={prediction.userAvatar}
                  alt={`${prediction.userName || prediction.userId}`}
                  width={40}
                  height={40}
                  className="rounded-full" // Changed to rounded-full for typical avatar look
                />
              ) : (
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-sm text-gray-300"> {/* Adjusted background/text color */}
                  ?
                </div>
              )}
              <p className="font-medium text-sm text-center"> {/* Centered text under avatar */}
                {prediction.userName || prediction.userId}
              </p>
            </div>

            {/* Score and Outcome Section: Vertically aligned score and outcome */}
            <div className="flex flex-col items-center"> {/* Flex column for score and outcome */}
              <p className="text-m text-lg"> {/* Larger for score */}
                {prediction.homeScore} - {prediction.awayScore}
              </p>
              <p className="text-m text-gray-400"> {/* Smaller for outcome, slightly lighter color */}
                ({prediction.outcome})
              </p>
            </div>

            {/* Odds & Points Section: Vertically aligned values under labels */}
            <div className="flex flex-col items-end"> {/* Align items to the end (right) */}
              <p className="text-sm text-gray-400">Odds</p> {/* Smaller text for label */}
              <p className="font-semibold text-sm">{prediction.odds}</p> {/* Slightly smaller for value */}
              <p className="text-sm text-gray-400 mt-1">Points</p> {/* Smaller text for label, with margin-top */}
              <p className="font-semibold text-sm"> {/* Slightly smaller for value */}
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
