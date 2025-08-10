import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET /api/users/[id]
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    const client = await clientPromise;
    const db = client.db("EPL2025");

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

// PUT /api/users/[id]
export async function PUT(
  req: NextRequest,
  context: any
) {
  try {
    const params = await context.params;
    const id = params.id;

    if (!ObjectId.isValid(id)) {
      console.error("Invalid ObjectId:", id);
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const body = await req.json();
    const userName = body.userName?.trim();

    console.log("PUT request for user:", id, "with new username:", userName);

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

    const updatedUser = result?.value;
    console.log("Updated user result:", updatedUser);

    if (!updatedUser) {
      return NextResponse.json({ error: "User update failed" }, { status: 500 });
    }

    return NextResponse.json({
      user: {
        _id: updatedUser._id.toString(),
        userName: updatedUser.userName,
        score: updatedUser.score ?? 0,
        correctScores: updatedUser.correctScores ?? 0,
        correctOutcomes: updatedUser.correctOutcomes ?? 0,
        profileImage: updatedUser.profileImage ?? null,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
