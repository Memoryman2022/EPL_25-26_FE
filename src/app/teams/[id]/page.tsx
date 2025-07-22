// app/teams/[id]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { teamNameToImageMap } from "@/app/utils/teamLogos";


type Params = {
  params: {
    id: string;
    name: string;
  };
};

export default async function TeamPage({ params }: Params) {
  const { id } = params;

  const API_URL = `https://api.football-data.org/v4/teams/${id}`;
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY; // Set this in .env
  const getTeamImage = (teamName: string): string =>
    `/teams/${teamNameToImageMap[teamName] || "default.png"}`;
  let team: any = null;

  try {
    const res = await fetch(API_URL, {
      headers: {
        "X-Auth-Token": API_KEY || "",
        "Cache-Control": "no-store",
      },
    });

    if (!res.ok) throw new Error(`Failed to fetch team: ${res.statusText}`);

    team = await res.json();
  } catch (err) {
    console.error("Error fetching team:", err);
    notFound();
  }

  if (!team) notFound();

  return (
    <div className="p-6 max-w-4xl mx-auto text-white bg-[rgba(0,0,0,0.5)]  shadow-md space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
     <Image
                       src={getTeamImage(team.name)}
                       alt={team.name}
                       width={60}
                       height={60}
                       className="rounded"
                     />


        <h1 className="text-3xl font-bold">{team.name}</h1>
      </div>

      {/* Club Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-300">Venue:</span>
          <div className="font-semibold">{team.venue}</div>
        </div>
        <div>
          <span className="text-gray-300">Founded:</span>
          <div className="font-semibold">{team.founded}</div>
        </div>
        <div>
          <span className="text-gray-300">Website:</span>
          <a
            href={team.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline"
          >
            {team.website}
          </a>
        </div>
        <div>
          <span className="text-gray-300">Coach:</span>
          <div className="font-semibold">{team.coach?.name || "N/A"}</div>
        </div>
      </div>

      {/* Squad */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Squad</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          {team.squad.map((player: any) => (
            <li
              key={player.id}
              className="p-3 rounded bg-gray-800 border border-gray-700"
            >
              <div className="font-bold">{player.name}</div>
              <div className="text-gray-400">{player.position || "N/A"}</div>
              <div className="text-gray-500 text-xs">
                {player.nationality}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
