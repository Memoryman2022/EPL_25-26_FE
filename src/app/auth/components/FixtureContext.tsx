"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Team = {
  id: string;
  name: string;
  shortName?: string;
  tla?: string;
  crest?: string;
};
export type Fixture = {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  utcDate: string;
  time?: string;
};

type FixtureContextType = {
  fixtures: Fixture[];
  setFixtures: (fixtures: Fixture[]) => void;
};

const FixtureContext = createContext<FixtureContextType>({
  fixtures: [],
  setFixtures: () => {},
});

export const useFixtures = () => useContext(FixtureContext);

export const FixtureProvider = ({ children }: { children: ReactNode }) => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  return (
    <FixtureContext.Provider value={{ fixtures, setFixtures }}>
      {children}
    </FixtureContext.Provider>
  );
};
