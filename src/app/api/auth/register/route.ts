import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcrypt';
// Import jwt or similar if you want token generation, or use a placeholder for now

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('EPL2025');

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date(),
      userName: null, // You can add this for later profile update
    });

    const newUser = {
      _id: result.insertedId.toString(),
      email,
      userName: null,
    };

    // TODO: Replace this with real token creation if you want JWT auth
    const fakeToken = "some-fake-token";

    return NextResponse.json({ user: newUser, token: fakeToken }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
