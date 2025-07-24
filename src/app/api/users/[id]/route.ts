// app/api/users/[id]/route.ts

import { NextResponse, NextRequest } from "next/server";
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

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const { userName } = await req.json();

    if (!userName) {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("EPL2025");

    const result = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { userName } },
      { returnDocument: "after" } // <-- MongoDB might ignore this; use `returnNewDocument: true` if needed
    );

    const updatedUser = result?.value;

    if (!updatedUser || !updatedUser.userName) {
      return NextResponse.json({ error: "User update failed or username missing" }, { status: 500 });
    }

    return NextResponse.json({
      user: {
        _id: updatedUser._id?.toString?.() ?? id, // defensively handle _id
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