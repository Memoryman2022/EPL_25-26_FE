import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("EPL2025");

    const users = await db.collection("users").find({}).toArray();

    // Transform data if necessary, for example, map _id from ObjectId to string
    const safeUsers = users.map(user => ({
      _id: user._id.toString(),
      userName: user.userName,          // Assuming you stored email as userName
      score: user.score || 0,
      correctScores: user.correctScores || 0,
      correctOutcomes: user.correctOutcomes || 0,
      profileImage: user.profileImage || null,
      previousPosition: user.previousPosition || null,
    }));

    return NextResponse.json(safeUsers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
