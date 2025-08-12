"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear all authentication data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");

    // Optionally, call an API route to destroy a cookie/session
    fetch("/api/logout", { method: "POST" }).catch(() => {});

    // Redirect to login or home
    router.push("/auth/login");
  }, [router]);

  return <div className="text-center mt-20 text-xl">Logging out...</div>;
}
