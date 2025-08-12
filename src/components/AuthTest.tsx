"use client";

import { useState } from "react";
import { useUser } from "@/app/auth/components/Context";
import { api } from "@/lib/api";

export default function AuthTest() {
  const { user, logout } = useUser();
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    try {
      // Test the users API endpoint
      const users = await api.get("/api/users");
      setTestResult(
        `✅ Authentication successful! Found ${users.length} users`
      );
    } catch (error) {
      setTestResult(
        `❌ Authentication failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 text-red-500">
        Please log in to test authentication
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto">
      <h3 className="text-lg font-bold mb-4">Authentication Test</h3>

      <div className="mb-4">
        <p>
          <strong>Logged in as:</strong> {user.userName}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>

      <div className="space-y-2">
        <button
          onClick={testAuth}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test API Authentication"}
        </button>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded ml-2"
        >
          Logout
        </button>
      </div>

      {testResult && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-sm">{testResult}</div>
      )}
    </div>
  );
}
