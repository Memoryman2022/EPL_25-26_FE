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
      <div className="user-profile w-full mx-auto p-2 bg-gray-800 ">
        <div className="flex gap-4 items-start">
          <div className="w-38 h-38 relative rounded-lg overflow-hidden">
        <Image
          src={user.profileImage || "/default-profile.png"}
          alt={`${user.userName} profile`}
          fill
          className="object-cover"
        />
      </div>
          <div className="flex flex-col gap-1 pl-5">
            <h2 className="text-xl font-bold text-left text-gray-300">{user.userName}</h2>
            <div className="grid grid-cols-2 w-[135px] gap-1 pt-2 border-t text-gray-300">
              <p className="font-semibold">POSITION:</p>
              <p className="text-right">{user.position}</p>

              <p className="font-semibold">SCORES:</p>
              <p className="text-right">{user.correctScores}</p>

              <p className="font-semibold">OUTCOMES:</p>
              <p className="text-right">{user.correctOutcomes}</p>

              <p className="font-semibold">POINTS:</p>
              <p className="text-right">{user.score}</p>
            </div>
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
