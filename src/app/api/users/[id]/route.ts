import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET /api/users/[id]
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("EPL2025");

    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      _id: user._id.toString(),
      userName: user.userName,
      score: user.score ?? 0,
      correctScores: user.correctScores ?? 0,
      correctOutcomes: user.correctOutcomes ?? 0,
      profileImage: user.profileImage ?? null,
    });
  } catch (err) {
    console.error("GET /api/users/[id] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/users/[id]
export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const body = await req.json();
    const userName = body.userName?.trim();

    if (!userName) {
      return NextResponse.json({ error: "Missing or empty username" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("EPL2025");

    const result = await db.collection("users").findOneAndUpdate(
  { _id: new ObjectId(id) },
  { $set: { userName } },
  { returnDocument: "after" as const }
);

if (!result || !result.value) {
  return NextResponse.json({ error: "User update failed" }, { status: 500 });
}

const updatedUser = result.value;

return NextResponse.json({
  _id: updatedUser._id.toString(),
  userName: updatedUser.userName,
  score: updatedUser.score ?? 0,
  correctScores: updatedUser.correctScores ?? 0,
  correctOutcomes: updatedUser.correctOutcomes ?? 0,
  profileImage: updatedUser.profileImage ?? null,
});
  } catch (error) {
    console.error("PUT /api/users/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
