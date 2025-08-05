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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fixtureId,
      userId,
      homeScore,
      awayScore,
      outcome,
      odds,
    } = body;

    if (
      !fixtureId ||
      !userId ||
      homeScore === undefined ||
      awayScore === undefined ||
      !outcome ||
      !odds
    ) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("EPL2025");

    const result = await db.collection("predictions").insertOne({
      fixtureId,
      userId,
      homeScore,
      awayScore,
      outcome,
      odds,
      calculated: true,
      updatedAt: new Date(),
    });

    const savedPrediction = await db
  .collection("predictions")
  .findOne({ _id: result.insertedId });

if (!savedPrediction) {
  return NextResponse.json({ error: "Prediction not found after insert" }, { status: 500 });
}

return NextResponse.json(savedPrediction);

  } catch (error) {
    console.error("Insert prediction error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      fixtureId,
      userId,
      homeScore,
      awayScore,
      outcome,
      odds,
    } = body;

    if (
      !fixtureId ||
      !userId ||
      homeScore === undefined ||
      awayScore === undefined ||
      !outcome ||
      !odds
    ) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("EPL2025");

    const result = await db.collection("predictions").findOneAndUpdate(
  { fixtureId, userId },
  {
    $set: {
      homeScore,
      awayScore,
      outcome,
      odds,
      calculated: true,
      updatedAt: new Date(),
    },
  },
  { returnDocument: "after" as const, upsert: true }
);

// Check if result is null or result.value is null
if (!result || !result.value) {
  return NextResponse.json({ error: "Prediction not found or update failed" }, { status: 404 });
}

return NextResponse.json(result.value);



  } catch (error) {
    console.error("Update prediction error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
