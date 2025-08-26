import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("EPL2025");
    const results = await db.collection("results").find({}).toArray();

    return NextResponse.json(results);
  } catch (err) {
    console.error("Error fetching all results:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
