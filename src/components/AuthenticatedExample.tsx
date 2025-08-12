"use client";

import { useState } from "react";
import { useUser } from "@/app/auth/components/Context";
import { api } from "@/lib/api";

export default function AuthenticatedExample() {
  const { user, logout } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const testAuthenticatedCall = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Example of making an authenticated API call
      const result = await api.get("/api/predictions?fixtureId=1");
      setMessage("Authenticated call successful!");
      console.log("API result:", result);
    } catch (error) {
      setMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to test authenticated calls</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Authentication Test</h2>

      <div className="mb-4">
        <p>
          <strong>User ID:</strong> {user._id}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Username:</strong> {user.userName}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>

      <div className="space-y-2">
        <button
          onClick={testAuthenticatedCall}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Authenticated API Call"}
        </button>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded ml-2"
        >
          Logout
        </button>
      </div>

      {message && <div className="mt-4 p-2 bg-gray-100 rounded">{message}</div>}
    </div>
  );
}
