// In /api/predictions/route.ts (or wherever your API logic lives)
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fixtureId = url.searchParams.get("fixtureId");
  const queryUserId = url.searchParams.get("userId");

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  let userId: string;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    userId = payload.userId;
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Use userId from token for private predictions,
  // ignore userId query param for security
  if (!fixtureId && !userId) {
    return NextResponse.json({ error: "Missing fixtureId or userId" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("EPL2025");

    const filter: any = {};

    if (fixtureId) filter.fixtureId = Number(fixtureId);

    // Only use authenticated userId for private fetches:
    if (!fixtureId) {
      filter.userId = userId;
    } else if (queryUserId) {
      filter.userId = queryUserId; // if you want to support public predictions by userId for fixtures
    }

    const predictions = await db.collection("predictions").find(filter).toArray();

    const cleaned = predictions.map((p) => ({
      ...p,
      _id: p._id.toString(),
      updatedAt: p.updatedAt?.toString(),
    }));

    return NextResponse.json({ predictions: cleaned });
  } catch (err) {
    console.error("Error fetching predictions:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
