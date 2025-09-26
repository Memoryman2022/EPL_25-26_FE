"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { getTeamImage } from "../utils/teamLogos";
import ResponsiveTeamName from "../utils/responsive-team-names";
import { useFixtures } from "../auth/components/FixtureContext";

// Types must match context and fixture page
type Team = {
  id: string;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
};

type Fixture = {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  utcDate: string;
  time: string;
};

type MatchDays = Record<string, Fixture[]>;
type MonthMap = Record<string, Record<string, Fixture[]>>;

export default function FixtureCalendarList() {
  const [matchDays, setMatchDays] = useState<MatchDays>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const { setFixtures } = useFixtures();

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const res = await fetch("/api/fixtures");
        if (!res.ok)
          throw new Error(`Error fetching fixtures: ${res.statusText}`);

        const data: { matchDays: MatchDays } = await res.json();

        // Convert UTC date -> local time
        const withTimes: MatchDays = {};
        let allFixtures: Fixture[] = [];
        for (const date in data.matchDays) {
          withTimes[date] = data.matchDays[date].map((fixture) => {
            // Ensure all IDs are strings
            const fixtureWithTime: Fixture = {
              ...fixture,
              id: String(fixture.id),
              homeTeam: {
                ...fixture.homeTeam,
                id: String(fixture.homeTeam.id),
              },
              awayTeam: {
                ...fixture.awayTeam,
                id: String(fixture.awayTeam.id),
              },
              time: moment(fixture.utcDate).format("HH:mm"),
            };
            allFixtures.push(fixtureWithTime);
            return fixtureWithTime;
          });
        }

        setMatchDays(withTimes);
        setFixtures(allFixtures); // Store all fixtures in context for navigation
      } catch (err: any) {
        setError(err.message || "Failed to load fixtures");
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, [setFixtures]);

  const toggleMonth = (month: string) => {
    setOpenMonths((prev) => ({ ...prev, [month]: !prev[month] }));
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  const sortedDates = Object.keys(matchDays).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const groupedByMonth: MonthMap = {};
  for (const date of sortedDates) {
    const month = moment(date).format("MMMM YYYY");
    if (!groupedByMonth[month]) groupedByMonth[month] = {};
    groupedByMonth[month][date] = matchDays[date];
  }

  return (
    <div className="max-w-screen-md mx-auto p-4 space-y-6">
      <h1 className="text-xl font-bold text-center mb-6">Match Day Calendar</h1>

      {Object.entries(groupedByMonth).map(([month, days]) => (
        <div
          key={month}
          className="bg-white/10 border border-white/20 rounded-lg shadow-md"
        >
          <button
            className="w-full text-left px-4 py-3 font-semibold text-lg bg-white/10 hover:bg-white/20 transition"
            onClick={() => toggleMonth(month)}
          >
            {month}
          </button>

          {openMonths[month] && (
            <div className="p-1 space-y-6">
              {Object.entries(days).map(([date, fixtures]) => (
                <div key={date} className="space-y-2">
                  <div className="text-[14px] font-semibold">
                    {moment(date).format("dddd, MMMM Do YYYY")}
                  </div>
                  <table className="w-full text-[10px] text-gray-100 border-collapse table-fixed">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-2 pl-4 w-[40%]">Home</th>
                        <th className="text-center py-2 w-[10%]">vs</th>
                        <th className="text-left py-2 pl-4 w-[40%]">Away</th>
                        <th className="text-right py-2 pr-4 w-[10%]">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fixtures.map((fixture: Fixture) => (
                        <tr
                          key={fixture.id}
                          className="hover:bg-white/10 cursor-pointer h-[50px]"
                          onClick={() => {
                            sessionStorage.setItem(
                              "selectedFixture",
                              JSON.stringify(fixture)
                            );
                            router.push(`/fixtures/${fixture.id}`);
                          }}
                        >
                          <td className="py-2 pl-1">
                            <div className="flex items-center gap-2 rounded p-3 shadow-md">
                              <Image
                                src={getTeamImage(fixture.homeTeam.name)}
                                alt={fixture.homeTeam.name}
                                width={16}
                                height={16}
                                className="rounded"
                              />
                              <Link href={`/teams/${fixture.homeTeam.id}`}>
                                <span className="hover:underline">
                                  <ResponsiveTeamName
                                    name={fixture.homeTeam.name}
                                  />
                                </span>
                              </Link>
                            </div>
                          </td>
                          <td className="py-2 text-center">vs</td>
                          <td className="py-2 pl-1">
                            <div className="flex items-center gap-2 rounded p-3 shadow-md">
                              <Image
                                src={getTeamImage(fixture.awayTeam.name)}
                                alt={fixture.awayTeam.name}
                                width={16}
                                height={16}
                                className="rounded"
                              />
                              <Link href={`/teams/${fixture.awayTeam.id}`}>
                                <span className="hover:underline">
                                  <ResponsiveTeamName
                                    name={fixture.awayTeam.name}
                                  />
                                </span>
                              </Link>
                            </div>
                          </td>
                          <td className="text-right pr-4 font-mono">
                            {fixture.time}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {sortedDates.length === 0 && (
        <p className="text-center text-sm text-gray-400">
          No match days available.
        </p>
      )}
    </div>
  );
}
