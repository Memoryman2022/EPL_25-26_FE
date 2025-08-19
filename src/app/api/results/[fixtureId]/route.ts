import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(
  req: Request,
  { params }: { params: { fixtureId: string } }
) {
  const fixtureId = parseInt(params.fixtureId, 10);

  if (isNaN(fixtureId)) {
    return NextResponse.json({ error: "Invalid fixtureId" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("EPL2025");

    const result = await db.collection("results").findOne({ fixtureId });

    if (!result) {
      return NextResponse.json(
        { message: "Result not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch fixture result error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
