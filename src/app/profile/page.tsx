"use client";

import { useEffect, useState } from "react";
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
  previousPosition?: number;
  movement?: "up" | "down" | "";
};

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get<User[]>("/api/users");
        const userId = localStorage.getItem("userId");

        if (userId) {
          const sorted = data
            .sort((a, b) => b.score - a.score)
            .map((u, i) => ({ ...u, position: i + 1 }));

          const currentUser = sorted.find((u) => u._id === userId) || null;
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    return (
        <div className="user-profile max-w-md mx-auto p-4">
        <h2>Guest Profile</h2>
        <div className="flex flex-row gap-4">

        <Image
          src="/default-profile.png"
          alt="Guest profile"
          width={100}
          height={100}
          className="rounded"
        />
        <p>User: Guest</p>
        <p>Score: N/A</p>
        <p>Position: N/A</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{user.userName}'s Profile</h2>
      <div className="flex flex-row gap-4">
      <Image
        src={user.profileImage || "/default-profile.png"}
        alt={`${user.userName} profile`}
        width={120}
        height={120}
        className="rounded-full mb-4"
      />
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
  );
}
