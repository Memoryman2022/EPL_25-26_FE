"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/app/auth/components/Context";
import { api } from "@/lib/api";
import UserPredictionsList from "@/components/UserPredictionsList";

type User = {
  _id: string;
  userName: string;
  score: number;
  correctScores: number;
  correctOutcomes: number;
  profileImage?: string;
  position?: number;
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
    <div className="p-4">
      <div className="user-profile max-w-md mx-auto p-4 bg-gray-800">
        <h2 className="text-2xl font-bold mb-4">{user.userName}</h2>
        <div className="flex gap-4 items-start">
          <Image
            src={user.profileImage || "/default-profile.png"}
            alt={`${user.userName} profile`}
            width={120}
            height={120}
            className="rounded-lg"
          />
          <div className="flex flex-col space-y-2">
            <p>
              <strong>Position:</strong> {user.position}
            </p>
            <p>
              <strong>Score:</strong> {user.score}
            </p>
            <p>
              <strong>Correct Scores:</strong> {user.correctScores}
            </p>
            <p>
              <strong>Correct Outcomes:</strong> {user.correctOutcomes}
            </p>
          </div>
        </div>
      </div>
      ✅ Show logged-in user's predictions
      {/* {authUser && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">My Predictions</h3>
          <UserPredictionsList />
        </div>
      )} */}
    </div>
  );
}
