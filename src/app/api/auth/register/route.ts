import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { generateToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { email, password, userName } = await req.json();

    if (!email || !password || !userName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (userName.trim().length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("EPL2025");

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("users").insertOne({
      userName: userName.trim(),
      email,
      password: hashedPassword,
      profileImage: "/uploads/default.png", // default image
      score: 0, // default score
      correctScores: 0,
      correctOutcomes: 0,
      movement: "none", // or "up"/"down" depending on your logic
      position: null, // or starting position
      previousPosition: null,
      role: "user", // default role
      createdAt: new Date(),
    });

    const newUser = {
      _id: result.insertedId.toString(),
      userName: userName.trim(),
      email,
      role: "user",
    };

    // Generate proper JWT token
    const token = generateToken({
      userId: result.insertedId.toString(),
      email,
      userName: userName.trim(),
      role: "user",
    });

    return NextResponse.json({ user: newUser, token }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
