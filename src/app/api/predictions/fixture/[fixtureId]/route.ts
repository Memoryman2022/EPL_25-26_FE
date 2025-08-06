import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(
  req: Request,
  { params }: { params: { fixtureId: string } }
) {
  const fixtureId = parseInt(params.fixtureId);

  if (!fixtureId) {
    return NextResponse.json({ error: "Missing or invalid fixtureId" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("EPL2025");

    const predictions = await db.collection("predictions").aggregate([
      { $match: { fixtureId } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "id", // adjust if your user field is different
          as: "userInfo"
        }
      },
      {
        $addFields: {
          userName: { $arrayElemAt: ["$userInfo.name", 0] },
          userAvatar: { $arrayElemAt: ["$userInfo.avatarUrl", 0] }
        }
      },
      {
        $project: {
          _id: 0,
          fixtureId: 1,
          userId: 1,
          userName: 1,
          userAvatar: 1,
          homeScore: 1,
          awayScore: 1,
          outcome: 1,
          odds: 1,
          points: 1
        }
      }
    ]).toArray();

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error("Fetch all fixture predictions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
