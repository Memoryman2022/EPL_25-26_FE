"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/app/auth/components/Context";
import { api } from "@/lib/api";
import LeaderboardClient from "../leaderboard/LeaderboardClient";

type User = {
  _id: string;
  userName: string;
  score: number;
  correctScores: number;
  correctOutcomes: number;
  profileImage?: string;
  position?: number;
  previousPosition?: number;
};

export default function UserProfile() {
  const { user: authUser } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const targetUserId = searchParams.get("userId") || authUser?._id;

    if (!targetUserId) {
      router.push("/auth/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await api.get<User[]>("/api/users");

        const sorted = data
          .sort((a, b) => b.score - a.score)
          .map((u, i) => ({ ...u, position: i + 1 }));

        const currentUser = sorted.find((u) => u._id === targetUserId) || null;
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to fetch user", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [authUser, router, searchParams]);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div>
      <div className="user-profile max-w-md mx-auto p-4 bg-gray-800  shadow-md">
        <h2 className="text-2xl font-bold text-center mt-0 m-4">
          {user.userName}
        </h2>
        <div className="flex gap-4 items-start">
          <Image
            src={user.profileImage || "/default-profile.png"}
            alt={`${user.userName} profile`}
            width={120}
            height={120}
            className="rounded-lg"
          />
          <div className="flex flex-col space-y-2">
            <p className="gap-10">
              <strong>POSITION:</strong> {user.position}
            </p>
            <p>
              <strong>POINTS:</strong> {user.score}
            </p>
            <p>
              <strong>SCORES:</strong> {user.correctScores}
            </p>
            <p>
              <strong>OUTCOMES:</strong> {user.correctOutcomes}
            </p>
          </div>
        </div>
      </div>

      {/* Logged-in user's predictions */}
      {authUser && (
        <div>
          <LeaderboardClient />
        </div>
      )}
    </div>
  );
}
