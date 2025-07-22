"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

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

export default function Leaderboard({
  onUserUpdate,
}: {
  onUserUpdate?: (user: User) => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [previousUsers, setPreviousUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`/api/users`);
      const sorted = data.sort((a: User, b: User) => b.score - a.score);

      const withPositions = sorted.map((user: User, i: number) => ({
  ...user,
  position: i + 1,
  previousPosition: user.previousPosition || i + 1,
  score: user.score || 0,
  correctScores: user.correctScores || 0,
  correctOutcomes: user.correctOutcomes || 0,
}));


      setUsers(withPositions);
      setPreviousUsers(withPositions);

      const userId = localStorage.getItem("userId");
      const currentUser = withPositions.find((u: User) => u._id === userId);
      if (currentUser && onUserUpdate) {
        onUserUpdate(currentUser);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto p-4 space-y-6">
      <h2 className="text-xl font-bold text-center mb-4">Leaderboard</h2>

      <table className="w-full text-[12px] table-auto border-separate border-spacing-y-2 text-sm text-white">
        <thead>
          <tr className="text-left bg-white/10">
            <th className="px-3 py-2 w-6">Pos</th>
            <th className="px-3 py-2">User</th>
            <th className="px-3 py-2 text-center">Scores</th>
            <th className="px-3 py-2 text-center">Outcomes</th>
            <th className="px-3 py-2 text-right">Points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="bg-white/5 hover:bg-white/10 rounded-lg transition"
            >
              <td className="px-3 py-2 font-mono font-semibold">
                {user.position}
              </td>
              <td className="px-3 py-2 flex items-center gap-2">
  <Image
    src="/default-profile.png"
    alt={user.userName}
    width={24}
    height={24}
    className="rounded shadow-sm"
  />
  <Link href={`/users/${user._id}`}
    className="hover:underline text-blue-400">{user.userName}
  </Link>
  {user.position &&
    user.previousPosition &&
    user.position < user.previousPosition && (
      <Image src="/gifs/up.gif" alt="up" width={16} height={16} />
    )}
  {user.position &&
    user.previousPosition &&
    user.position > user.previousPosition && (
      <Image src="/gifs/down.gif" alt="down" width={16} height={16} />
    )}
</td>
              <td className="px-3 py-2 text-center">{user.correctScores}</td>
              <td className="px-3 py-2 text-center">{user.correctOutcomes}</td>
              <td className="px-3 py-2 text-right font-mono font-semibold">
                {user.score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <p className="text-center text-sm text-gray-400">No users found.</p>
      )}
    </div>
  );
}
