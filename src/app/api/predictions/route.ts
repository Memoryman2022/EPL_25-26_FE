import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fixtureId = url.searchParams.get("fixtureId");
  const userId = url.searchParams.get("userId");

  if (!fixtureId || !userId) {
    return NextResponse.json({ error: "Missing fixtureId or userId" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("EPL2025");

    const prediction = await db.collection("predictions").findOne({
      fixtureId: parseInt(fixtureId),
      userId: userId,
    });

    return NextResponse.json({ prediction });
  } catch (error) {
    console.error("Fetch prediction error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
