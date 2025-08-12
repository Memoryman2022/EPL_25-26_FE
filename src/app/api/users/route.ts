import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: Request) {
  try {
    // Check authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Access token required" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db("EPL2025");

    const users = await db.collection("users").find({}).toArray();

    // Transform data if necessary, for example, map _id from ObjectId to string
    const safeUsers = users.map((user) => ({
      _id: user._id.toString(),
      userName: user.userName, // Assuming you stored email as userName
      score: user.score || 0,
      correctScores: user.correctScores || 0,
      correctOutcomes: user.correctOutcomes || 0,
      profileImage: user.profileImage || null,
      previousPosition: user.previousPosition || null,
    }));

    return NextResponse.json(safeUsers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
