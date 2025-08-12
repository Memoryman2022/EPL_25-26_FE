import { NextResponse } from "next/server";

export async function POST() {
  // In a JWT-based system, the client handles logout by removing the token
  // This endpoint can be used for additional cleanup if needed

  const response = NextResponse.json({ message: "Logged out successfully" });

  // Clear any cookies if you're using them
  response.cookies.delete("auth-token");

  return response;
}
