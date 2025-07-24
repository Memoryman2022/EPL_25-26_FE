"use client";

import Image from "next/image";
import { getTeamImage } from "../../utils/teamLogos";
import ResponsiveTeamName from "@/app/utils/responsive-team-names";
import MatchPredictionForm from "@/components/MatchPredictionForm";

type Team = {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crest?: string;
};

type Fixture = {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  utcDate: string;
  time?: string;
};

type Props = {
  fixture: Fixture;
  userId: string;
};

export default function FixturePage({ fixture, userId }: Props) {
  return (
    <div className="p-4 max-w-screen-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {fixture.homeTeam.name} vs {fixture.awayTeam.name}
      </h1>

      <div className="flex items-center gap-8 mb-4">
        <div className="flex flex-col items-center">
          <Image
            src={getTeamImage(fixture.homeTeam.name)}
            alt={fixture.homeTeam.name}
            width={48}
            height={48}
            className="rounded"
          />
          <ResponsiveTeamName name={fixture.homeTeam.name} />
        </div>

        <div className="text-xl font-semibold">vs</div>

        <div className="flex flex-col items-center">
          <Image
            src={getTeamImage(fixture.awayTeam.name)}
            alt={fixture.awayTeam.name}
            width={48}
            height={48}
            className="rounded"
          />
          <ResponsiveTeamName name={fixture.awayTeam.name} />
        </div>
      </div>

      <p className="mb-2 font-semibold">
        Date: <span className="font-normal">{fixture.utcDate}</span>
      </p>
      <p className="mb-6 font-semibold">
        Time: <span className="font-normal">{fixture.time || "TBD"}</span>
      </p>

      {/* Prediction form */}
      <MatchPredictionForm fixture={fixture} userId={userId} />
    </div>
  );
}
