// src/app/api/standings/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
  const url = 'https://api.football-data.org/v4/competitions/2021/standings';

  try {
    const res = await fetch(url, {
      headers: {
        'X-Auth-Token': API_KEY || '',
      },
      next: { revalidate: 3600 }, // Optional: revalidate every hour
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
