import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("EPL2025");
    // Fetch all teams, sorted by rank ascending
    const teams = await db
      .collection("rankings")
      .find({})
      .sort({ rank: 1 })
      .toArray();
    return NextResponse.json(teams);
  } catch (error) {
    console.error("Failed to fetch rankings:", error);
    return NextResponse.json(
      { error: "Failed to fetch rankings" },
      { status: 500 }
    );
  }
}
