// app/api/users/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Mock user data
  const mockUsers = [
    {
      _id: "1",
      userName: "Jane Doe",
      score: 75,
      correctScores: 10,
      correctOutcomes: 20,
      profileImage: null,
      previousPosition: 2,
    },
    {
      _id: "2",
      userName: "John Smith",
      score: 90,
      correctScores: 12,
      correctOutcomes: 22,
      profileImage: null,
      previousPosition: 1,
    },
    {
      _id: "3",
      userName: "The Predictor",
      score: 60,
      correctScores: 7,
      correctOutcomes: 17,
      profileImage: null,
      previousPosition: 4,
    },
  ];

  return NextResponse.json(mockUsers);
}
