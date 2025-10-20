"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getTeamImage } from "../../utils/teamLogos";
import ResponsiveTeamName from "@/app/utils/responsive-team-names";
import MatchPredictionForm from "@/components/MatchPredictionForm";
import { formatDateTime } from "../../utils/formatDate";
import { useUser } from "@/app/auth/components/Context";
import UserPredictionsList from "@/components/UserPredictionsList";
import { api } from "@/lib/api";
import { useFixtures } from "@/app/auth/components/FixtureContext";

// -------------------- Types --------------------
type Team = {
  id: string;
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

type Result = {
  fixtureId: number;
  score: {
    fullTime: { home: number; away: number };
    winner: string;
  };
};

// -------------------- Main FixturePage --------------------
function FixturePage({
  fixture,
  userId,
}: {
  fixture: Fixture;
  userId: string;
}) {
  const [hasUserPredicted, setHasUserPredicted] = useState<boolean>(false);
  const [loadingPredictions, setLoadingPredictions] = useState<boolean>(true);
  const [result, setResult] = useState<Result | null>(null);
  const [loadingResult, setLoadingResult] = useState<boolean>(true);
  const [resultNotFound, setResultNotFound] = useState<boolean>(false);

  // Fetch user predictions
  useEffect(() => {
    const checkUserPrediction = async () => {
      try {
        const data: { predictions?: any[] } = await api.get(
          `/api/predictions?fixtureId=${fixture.id}`
        );
        const found = data?.predictions?.some((p) => p.userId === userId);
        setHasUserPredicted(found || false);
      } catch (err) {
        console.error("Error fetching predictions:", err);
        setHasUserPredicted(false);
      } finally {
        setLoadingPredictions(false);
      }
    };
    checkUserPrediction();
  }, [fixture.id, userId]);

  // Fetch fixture result
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data: Result = await api.get(`/api/results/${fixture.id}`);
        setResult(data);
        setResultNotFound(false);
      } catch (err: any) {
        if (err?.response?.status === 404 || err?.message?.includes("404")) {
          setResult(null);
          setResultNotFound(true);
        } else {
          console.error("Error fetching fixture result:", err);
          setResult(null);
          setResultNotFound(false);
        }
      } finally {
        setLoadingResult(false);
      }
    };
    fetchResult();
  }, [fixture.id]);

  return (
    <div className="p-4 max-w-screen-md mx-auto flex flex-col items-center space-y-6">
      <span className="bg-gray-800 px-2 py-2 border rounded text-white text-l text-gray-200 font-semibold">
        {formatDateTime(fixture.utcDate)}
      </span>
      <span className="text-xs text-gray-400">Fixture ID: {fixture.id}</span>

      {/* Teams */}
      <div className="flex items-center justify-center gap-6 w-full max-w-sm mx-auto">
        <div className="flex flex-col items-center flex-1">
          <Image
            src={getTeamImage(fixture.homeTeam.name)}
            alt={fixture.homeTeam.name}
            width={80}
            height={80}
            className="rounded"
          />
          <ResponsiveTeamName name={fixture.homeTeam.name} />
        </div>

        <div className="text-lg font-semibold w-12 text-center">vs</div>

        <div className="flex flex-col items-center flex-1">
          <Image
            src={getTeamImage(fixture.awayTeam.name)}
            alt={fixture.awayTeam.name}
            width={80}
            height={80}
            className="rounded"
          />
          <ResponsiveTeamName name={fixture.awayTeam.name} />
        </div>
      </div>

      {/* Result */}
      {loadingResult ? (
        <p className="text-gray-400">Loading result...</p>
      ) : resultNotFound ? (
        <p className="text-white">Result not available yet.</p>
      ) : result ? (
        <div className="text-center mt-2 text-xl font-semibold">
          {result.score.fullTime.home} - {result.score.fullTime.away} <br />
          <br />
          {result.score.winner || "N/A"}
        </div>
      ) : (
        <p className="text-white">No result yet.</p>
      )}

      {/* Prediction form or list */}
      {loadingPredictions ? (
        <p className="text-gray-400">Loading predictions...</p>
      ) : hasUserPredicted ? (
        <UserPredictionsList mode="fixture" fixtureId={fixture.id.toString()} />
      ) : (
        <MatchPredictionForm
          fixture={fixture}
          userId={userId}
          setHasUserPredicted={setHasUserPredicted}
        />
      )}
    </div>
  );
}

// -------------------- Wrapper --------------------
export default function FixturePageWrapper() {
  const [fixture, setFixture] = useState<Fixture | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams<{ id: string }>();
  const { user } = useUser();
  const { fixtures, setFixtures } = useFixtures();
  const router = useRouter();

  useEffect(() => {
    const loadFixture = async () => {
      const fixtureId = parseInt(params.id, 10);

      // First try to find in context
      if (fixtures && fixtures.length > 0) {
        const found = fixtures.find((f) => f.id === fixtureId);
        if (found) {
          setFixture(found);
          sessionStorage.setItem("selectedFixture", JSON.stringify(found));
          setLoading(false);
          return;
        }
      }

      // If not found in context, try to load from sessionStorage
      const storedFixture = sessionStorage.getItem("selectedFixture");
      if (storedFixture) {
        try {
          const parsedFixture = JSON.parse(storedFixture);
          if (parsedFixture.id === fixtureId) {
            setFixture(parsedFixture);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Error parsing stored fixture:", e);
        }
      }

      // If still not found, load fixtures from API
      try {
        const res = await fetch("/api/fixtures");
        if (res.ok) {
          const data = await res.json();
          let allFixtures: Fixture[] = [];

          // Flatten the matchDays structure
          for (const date in data.matchDays) {
            allFixtures = allFixtures.concat(data.matchDays[date]);
          }

          const found = allFixtures.find((f) => f.id === fixtureId);
          if (found) {
            setFixture(found);
            sessionStorage.setItem("selectedFixture", JSON.stringify(found));
            // Also update the context for future navigation
            setFixtures(allFixtures);
          }
        }
      } catch (error) {
        console.error("Error loading fixtures:", error);
      }

      setLoading(false);
    };

    loadFixture();
  }, [fixtures, params.id, setFixtures]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!fixture)
    return (
      <div className="p-4 text-red-500">
        Fixture not found or not passed correctly.
      </div>
    );
  if (!user || !user._id)
    return (
      <div className="mb-2 font-semibold text-xl pt-50 text-center">
        You must be logged in to view this page.
      </div>
    );

  // Find current index
  const currentIndex = fixtures.findIndex((f) => f.id === fixture.id);

  // Navigation handlers
  const goToFixture = (index: number) => {
    const nextFixture = fixtures[index];
    if (nextFixture) {
      router.push(`/fixtures/${nextFixture.id}`);
      sessionStorage.setItem("selectedFixture", JSON.stringify(nextFixture));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          disabled={currentIndex <= 0}
          onClick={() => goToFixture(currentIndex - 1)}
          className="px-3 py-1 rounded bg-black mt-2 disabled:opacity-50"
        >
          ← Prev
        </button>
        <span className="font-bold text-lg mt-2">
          Fixture {currentIndex + 1} of {fixtures.length}
        </span>
        <button
          disabled={currentIndex >= fixtures.length - 1}
          onClick={() => goToFixture(currentIndex + 1)}
          className="px-3 py-1 rounded bg-black mt-2 disabled:opacity-50"
        >
          Next →
        </button>
      </div>
      <FixturePage fixture={fixture} userId={user._id} />
    </div>
  );
}
