"use client";

import { useState } from "react";
import AuthForm from "./components/AuthForm";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="mt-8 space-x-2">
        <button
          onClick={() => setMode("login")}
          className={`px-4 py-2 rounded ${
            mode === "login"
              ? "bg-blue-800 text-yellow-400"
              : "bg-gray-600 text-gray-400"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setMode("register")}
          className={`px-4 py-2 rounded ${
            mode === "register"
              ? "bg-blue-800 text-yellow-400"
              : "bg-gray-600 text-gray-400"
          }`}
        >
          Register
        </button>
      </div>

      <AuthForm type={mode} />
    </div>
  );
}
