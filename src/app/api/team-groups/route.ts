import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { groupTeams, Team } from "@/app/utils/teamGroups";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("EPL2025");
    const teams = await db
      .collection<Team>("rankings")
      .find({})
      .sort({ rank: 1 })
      .toArray();
    const grouped = groupTeams(teams);
    return NextResponse.json({ grouped });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch and group teams", details: error },
      { status: 500 }
    );
  }
}
