// src/app/api/fixtures/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
  const url = 'https://api.football-data.org/v4/competitions/2021/matches';

  try {
    const res = await fetch(url, {
      headers: {
        'X-Auth-Token': API_KEY || '',
      },
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch fixtures' }, { status: res.status });
    }

    const data = await res.json();

    // Optional: group matches by date
    const matchDays: Record<string, any[]> = {};
    for (const match of data.matches) {
      const date = match.utcDate.slice(0, 10); // e.g. "2025-08-10"
      if (!matchDays[date]) matchDays[date] = [];
      matchDays[date].push(match);
    }

    return NextResponse.json({ matchDays });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
