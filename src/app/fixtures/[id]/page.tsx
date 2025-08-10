"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getTeamImage } from "../../utils/teamLogos";
import ResponsiveTeamName from "@/app/utils/responsive-team-names";
import MatchPredictionForm from "@/components/MatchPredictionForm";
import { formatDateTime } from "../../utils/formatDate";
import { useUser } from "@/app/auth/components/Context";
import UserPredictionsList from "@/components/UserPredictionsList";
 // adjust the path as needed

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

// Main FixturePage component
function FixturePage({ fixture, userId }: Props) {
  return (
    <div className="p-4 max-w-screen-md mx-auto flex flex-col items-center space-y-6">
      <span className="bg-gray-800 px-2 py-2 border rounded text-xl text-gray-200 font-semibold">
        {formatDateTime(fixture.utcDate)}
      </span>

      <div className="flex items-center justify-center gap-6 w-full max-w-sm mx-auto">
        <div className="flex flex-col items-center flex-1">
          <Image
            src={getTeamImage(fixture.homeTeam.name)}
            alt={fixture.homeTeam.name}
            width={48}
            height={48}
            className="rounded"
          />
          <ResponsiveTeamName name={fixture.homeTeam.name} />
        </div>

        <div className="text-lg font-semibold w-12 text-center">vs</div>

        <div className="flex flex-col items-center flex-1">
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

      {/* Prediction form */}
      <MatchPredictionForm fixture={fixture} userId={userId} />
      

      
    </div>
  );
}

// Wrapper component that fetches the fixture and current user id
export default function FixturePageWrapper() {
  const [fixture, setFixture] = useState<Fixture | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  const { user } = useUser(); // assuming useUser returns { user: { _id: string, ... }, setUser: ... }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("selectedFixture");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Fixture;
          if (parsed.id.toString() === params.id) {
            setFixture(parsed);
          }
        } catch (e) {
          console.error("Invalid fixture in sessionStorage");
        }
      }
      setLoading(false);
    }
  }, [params.id]);

  if (loading) return <div className="p-4">Loading...</div>;

  if (!fixture) {
    return (
      <div className="p-4 text-red-500">
        Fixture not found or not passed correctly.
      </div>
    );
  }

  if (!user || !user._id) {
    return (
      <div className="mb-2 font-semibold text-xl pt-50 text-center">You must be logged in to view this page.
      </div>
    );
  }

  return <FixturePage fixture={fixture} userId={user._id} />;
}
