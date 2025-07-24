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
};

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [usernameInput, setUsernameInput] = useState("");
  const [saving, setSaving] = useState(false);

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

  const handleSaveUsername = async () => {
    if (!user || !usernameInput.trim()) return;

    setSaving(true);
    try {
      const res = await axios.put(`/api/users/${user._id}`, {
        userName: usernameInput.trim(),
      });

      setUser((prev) => prev && { ...prev, userName: usernameInput.trim() });
      alert("Username saved!");
    } catch (err) {
      alert("Failed to save username.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  if (!user) {
    return (
      <div className="user-profile max-w-md mx-auto p-4">
        <h2>Guest Profile</h2>
        <p>User: Guest</p>
      </div>
    );
  }

  return (
    <div className="user-profile max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      {!user.userName ? (
        <div className="mb-6">
          <p className="mb-2">Choose your username:</p>
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <button
            onClick={handleSaveUsername}
            disabled={saving}
            className="bg-blue-900 text-yellow-400 px-4 py-2 rounded hover:bg-blue-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Username"}
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={user.profileImage || "/default-profile.png"}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full"
            />
            <div>
              <p><strong>Username:</strong> {user.userName}</p>
              <p><strong>Position:</strong> {user.position}</p>
              <p><strong>Score:</strong> {user.score}</p>
              <p><strong>Correct Scores:</strong> {user.correctScores}</p>
              <p><strong>Correct Outcomes:</strong> {user.correctOutcomes}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
