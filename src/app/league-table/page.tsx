"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { teamNameToImageMap } from "../utils/teamLogos";
import ResponsiveTeamName from "../utils/responsive-team-names";
import Link from "next/link";
import { api } from "@/lib/api";

// import '@/styles/EPL_Table.css'; // move CSS here from `css/` to `styles/`

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Team = {
  id: number;
  name: string;
};

type Standing = {
  position: number;
  team: Team;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalDifference: number;
  points: number;
};

const formatOrdinal = (n: number): string => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const getTeamImage = (teamName: string): string =>
  `/teams/${teamNameToImageMap[teamName] || "default.png"}`;

export default function EPLTable() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);
  const [headers, setHeaders] = useState({
    position: "Position",
    points: "Points",
  });

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await api.get("/api/standings");
        const standingsData: Standing[] = response?.standings?.[0]?.table || [];

        setStandings(standingsData);
      } catch (err: any) {
        console.error("Error fetching standings:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setHeaders(
        window.innerWidth <= 600
          ? { position: "", points: "P" }
          : { position: "Position", points: "Points" }
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;

  return (
    <div className="overflow-x-auto p-4 text-shadow">
      <table className="min-w-full rounded-lg shadow-md ">
        <thead className="bg-gradient-to-b from-gray-00 to-gray-900 text-white text-[12px] sticky top-0 z-10">
          <tr>
            <th className="py-1 px-1 text-left">Pos</th>
            <th className="py-1 px-6 text-left">Team</th>
            <th className="py-1 px-3 text-center">PLD</th>
            <th className="py-1 px-3 text-center">W</th>
            <th className="py-1 px-3 text-center">D</th>
            <th className="py-1 px-3 text-center">L</th>
            <th className="py-1 px-3 text-center">+/-</th>
            <th className="py-1 px-2 text-center">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => (
            <tr
              key={index}
              className={`text-[10px] text-white shadow-sm border-gray-100 ${
                index % 2 === 0
                  ? "bg-[rgba(31,41,55,0.3)]"
                  : "bg-[rgba(0,0,0,0.3)]"
              } hover:bg-gray-900 transition`}
            >
              <td className="py-1 px-1">{formatOrdinal(index + 1)}</td>
              {/* <td className="py-1 px-1">{formatOrdinal(team.position)}</td> */}

              <td className="py-1 px-3 flex items-center gap-2 ">
                <Image
                  src={getTeamImage(team.team.name)}
                  alt={team.team.name}
                  width={14}
                  height={14}
                  className="rounded"
                />
                <Link href={`/teams/${team.team.id}`}>
                  <span className="hover:underline">
                    <ResponsiveTeamName name={team.team.name} />
                  </span>
                </Link>
              </td>
              <td className="py-1 px-3 text-center">{team.playedGames}</td>
              <td className="py-1 px-3 text-center">{team.won}</td>
              <td className="py-1 px-3 text-center">{team.draw}</td>
              <td className="py-1 px-3 text-center">{team.lost}</td>
              <td className="py-1 px-3 text-center">{team.goalDifference}</td>
              <td className="py-1 px-2 text-center font-bold">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
