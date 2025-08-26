export interface MatchResult {
  fixtureId: number;
  homeTeam: { name: string };
  awayTeam: { name: string };
  score: {
    fullTime: {
      home: number;
      away: number;
    };
    winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
  };
}

export interface UserPrediction {
  fixtureId: number;
  userId: string;
  homeScore: number;
  awayScore: number;
  outcome: "home_win" | "away_win" | "draw";
}

export interface User {
  _id: string;
  userName: string;
  email: string;
  password: string;
  profileImage: string;
  score: number;
  correctScores: number;
  correctOutcomes: number;
  movement: string;
  position: number;
  previousPosition: number;
  role: string;
  createdAt: string;
}
