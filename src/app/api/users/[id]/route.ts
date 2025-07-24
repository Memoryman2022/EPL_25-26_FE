// app/api/users/[id]/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("EPL2025");
    const { id } = params;

    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      _id: user._id.toString(),
      userName: user.userName,
      score: user.score || 0,
      correctScores: user.correctScores || 0,
      correctOutcomes: user.correctOutcomes || 0,
      profileImage: user.profileImage || null,
    });
  } catch (err) {
    console.error("GET /api/users/[id] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
