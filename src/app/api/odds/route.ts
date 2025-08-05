import { NextRequest, NextResponse } from "next/server";

function calculateOdds(home: number, away: number): string {
  const diff = Math.abs(home - away);
  const total = home + away;

  let baseNumerator = 1 + diff + Math.floor(total / 2);
  if (total > 5) baseNumerator += total - 5;

  // Clamp odds range to something reasonable
  const numerator = Math.max(2, Math.min(baseNumerator, 25));
  const denominator = [1, 2, 3][Math.floor(Math.random() * 3)];

  return `${numerator}/${denominator}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const homeScore = parseInt(searchParams.get("home") || "0", 10);
  const awayScore = parseInt(searchParams.get("away") || "0", 10);

  if (isNaN(homeScore) || isNaN(awayScore)) {
    return NextResponse.json({ error: "Invalid scores" }, { status: 400 });
  }

  const odds = calculateOdds(homeScore, awayScore);

  return NextResponse.json({ odds });
}
