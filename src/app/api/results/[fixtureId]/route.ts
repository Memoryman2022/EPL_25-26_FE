import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(
  req: Request,
  context: { params: Promise<{ fixtureId: string }> }
) {
  const { fixtureId } = await context.params; // ✅ await params
  const id = parseInt(fixtureId, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid fixtureId" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("EPL2025");

    const result = await db.collection("results").findOne({ fixtureId: id });

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
