"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import ResponsiveTeamName from "../utils/responsive-team-names";

// import '@/styles/EPL_Table.css'; // move CSS here from `css/` to `styles/`

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const teamNameToImageMap: Record<string, string> = {
  "Arsenal FC": "Arsenal.png",
  "Aston Villa FC": "Aston Villa.png",
  "AFC Bournemouth": "Bournemouth.png",
  "Brentford FC": "Brentford.png",
  "Brighton & Hove Albion FC": "Brighton.png",
  "Burnley FC": "Burnley.png",
  "Chelsea FC": "Chelsea.png",
  "Crystal Palace FC": "Crystal Palace.png",
  "Everton FC": "Everton.png",
  "Fulham FC": "Fulham.png",
  "Leeds United FC": "Leeds.png",
  "Liverpool FC": "Liverpool.png",
  "Manchester City FC": "Manchester City.png",
  "Manchester United FC": "Manchester United.png",
  "Newcastle United FC": "Newcastle United.png",
  "Nottingham Forest FC": "Nottm Forest.png",
  "Sunderland AFC": "Sunderland.png",
  "Tottenham Hotspur FC": "Tottenham Hotspur.png",
  "West Ham United FC": "West Ham United.png",
  "Wolverhampton Wanderers FC": "Wolves.png",
};

const formatOrdinal = (n: number): string => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const getTeamImage = (teamName: string): string =>
  `/teams/${teamNameToImageMap[teamName] || "default.png"}`;

export default function EPLTable() {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);
  const [headers, setHeaders] = useState({
    position: "Position",
    points: "Points",
  });

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await axios.get("/api/standings"); // Call your own route
        const standingsData = response.data?.standings?.[0]?.table || [];
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
        <thead className="bg-gradient-to-b from-green-00 to-green-900 text-white text-[12px] sticky top-0 z-10">
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
              } hover:bg-gray-200 transition`}
            >
              <td className="py-1 px-1">{formatOrdinal(team.position)}</td>
              <td className="py-1 px-3 flex items-center gap-2 ">
                <Image
                  src={getTeamImage(team.team.name)}
                  alt={team.team.name}
                  width={14}
                  height={14}
                  className="rounded"
                />
                <ResponsiveTeamName name={team.team.name} />
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
