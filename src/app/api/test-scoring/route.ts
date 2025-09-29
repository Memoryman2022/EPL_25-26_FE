import { NextResponse } from "next/server";
import { calculatePredictionPoints } from "@/models/scoring";

export async function POST(req: Request) {
  const { result, prediction } = await req.json();
  const pointsData = calculatePredictionPoints(result, prediction);
  return NextResponse.json(pointsData);
}
