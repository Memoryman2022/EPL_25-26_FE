import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface Prediction {
  _id?: string;
  fixtureId: number;
  userId: string;
  homeScore: number;
  awayScore: number;
  outcome?: "homeWin" | "draw" | "awayWin";
  odds?: string;
  calculated?: boolean;
  updatedAt?: string;
  userName?: string;
}

// GET handler to fetch predictions for a fixture
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const fixtureIdParam = url.searchParams.get("fixtureId");

    if (!fixtureIdParam) {
      return NextResponse.json(
        { error: "Missing fixtureId query parameter" },
        { status: 400 }
      );
    }

    const fixtureId = Number(fixtureIdParam);
    if (isNaN(fixtureId)) {
      return NextResponse.json(
        { error: "Invalid fixtureId parameter" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("EPL2025");

    const predictions = await db
      .collection("predictions")
      .find({ fixtureId })
      .toArray();

    // Convert _id ObjectId to string
    const cleanedPredictions = predictions.map((p) => ({
      ...p,
      _id: p._id.toString(),
      updatedAt: p.updatedAt ? p.updatedAt.toString() : undefined,
    }));

    return NextResponse.json({ predictions: cleanedPredictions });
  } catch (error) {
    console.error("Fetch predictions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST handler to create/update a prediction
export async function POST(request: Request) {
  try {
    const prediction: Prediction = await request.json();

    // Basic validation
    if (
      !prediction.userId ||
      !prediction.fixtureId ||
      prediction.homeScore === undefined ||
      prediction.awayScore === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required prediction fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("EPL2025");

    let userObjectId: ObjectId;
    try {
      userObjectId = new ObjectId(prediction.userId);
    } catch {
      return NextResponse.json(
        { error: "Invalid userId format" },
        { status: 400 }
      );
    }

    // Fetch user to get userName
    const user = await db.collection("users").findOne({
      _id: userObjectId,
    });

    if (!user || typeof user.name !== "string") {
      return NextResponse.json(
        { error: "User not found or invalid user data" },
        { status: 404 }
      );
    }

    prediction.userName = user.name;

    // Calculate outcome if not present
    if (!prediction.outcome) {
      if (prediction.homeScore > prediction.awayScore) {
        prediction.outcome = "homeWin";
      } else if (prediction.homeScore < prediction.awayScore) {
        prediction.outcome = "awayWin";
      } else {
        prediction.outcome = "draw";
      }
    }

    // Set updatedAt timestamp
    prediction.updatedAt = new Date().toISOString();

    // Upsert prediction by fixtureId and userId
    const result = await db.collection("predictions").findOneAndUpdate(
      { fixtureId: prediction.fixtureId, userId: prediction.userId },
      { $set: prediction },
      { upsert: true, returnDocument: "after" as const }
    );

    const saved = result?.value;

    if (!saved) {
      return NextResponse.json(
        { error: "Failed to save prediction" },
        { status: 500 }
      );
    }

    // Convert _id to string before returning
    return NextResponse.json({
      ...saved,
      _id: saved._id.toString(),
      updatedAt: saved.updatedAt ? saved.updatedAt.toString() : undefined,
    });
  } catch (error) {
    console.error("Save prediction error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
