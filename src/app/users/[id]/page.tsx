"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";

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
  const params = useParams();
  const userId = params.id;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get<User[]>(`/api/users`);
        const sorted = data
          .sort((a, b) => b.score - a.score)
          .map((u, i) => ({ ...u, position: i + 1 }));
        const currentUser = sorted.find((u) => u._id === userId) || null;
        setUser(currentUser);
      } catch (err) {
        console.error("Failed to fetch user", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <p>Loading profile...</p>;

  if (!user)
    return <p>User not found.</p>;

  return (
    <div className="user-profile max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{user.userName}'s Profile</h2>
      <div className="flex gap-4">
        <Image
          src={user.profileImage || "/default-profile.png"}
          alt={`${user.userName} profile`}
          width={120}
          height={120}
          className="rounded-full"
        />
        <div>
          <p><strong>Position:</strong> {user.position}</p>
          <p><strong>Score:</strong> {user.score}</p>
          <p><strong>Correct Scores:</strong> {user.correctScores}</p>
          <p><strong>Correct Outcomes:</strong> {user.correctOutcomes}</p>
        </div>
      </div>
    </div>
  );
}
