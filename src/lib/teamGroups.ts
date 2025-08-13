// Team grouping utility based on database rankings

export interface Team {
  _id: string;
  name: string;
  rank: number;
  points: number;
  goalDifference: number;
  goalsFor: number;
  goalsAgainst: number;
  matchesPlayed: number;
}

export interface TeamGroups {
  G1: Team[]; // Ranks 1-5 (Top tier)
  G2: Team[]; // Ranks 6-10 (Upper middle)
  G3: Team[]; // Ranks 11-15 (Lower middle)
  G4: Team[]; // Ranks 16-20 (Bottom tier)
}

/**
 * Groups teams into 4 strength tiers based on their database rankings
 */
export function groupTeamsByStrength(teams: Team[]): TeamGroups {
  const G1: Team[] = [];
  const G2: Team[] = [];
  const G3: Team[] = [];
  const G4: Team[] = [];

  // Sort teams by rank to ensure proper grouping
  const sortedTeams = teams.sort((a, b) => a.rank - b.rank);

  for (const team of sortedTeams) {
    if (team.rank >= 1 && team.rank <= 5) {
      G1.push(team);
    } else if (team.rank >= 6 && team.rank <= 10) {
      G2.push(team);
    } else if (team.rank >= 11 && team.rank <= 15) {
      G3.push(team);
    } else if (team.rank >= 16 && team.rank <= 20) {
      G4.push(team);
    }
  }

  return { G1, G2, G3, G4 };
}

/**
 * Gets the strength group (1-4) for a given team rank
 */
export function getTeamGroup(rank: number): number {
  if (rank >= 1 && rank <= 5) return 1;
  if (rank >= 6 && rank <= 10) return 2;
  if (rank >= 11 && rank <= 15) return 3;
  if (rank >= 16 && rank <= 20) return 4;
  return 4; // Default to bottom group
}

/**
 * Calculates the difficulty multiplier based on team strength groups
 * Higher rewards for predicting upsets (weaker team beating stronger team)
 */
export function calculateGroupBasedDifficulty(
  homeRank: number,
  awayRank: number,
  predictedOutcome: "home_win" | "away_win" | "draw"
): {
  difficulty: "Easy" | "Medium" | "Hard";
  multiplier: number;
  explanation: string;
} {
  const homeGroup = getTeamGroup(homeRank);
  const awayGroup = getTeamGroup(awayRank);
  const groupDifference = Math.abs(homeGroup - awayGroup);

  // Determine if this is an upset prediction
  let isUpset = false;
  let isExpectedWin = false;

  if (predictedOutcome === "home_win") {
    if (homeGroup > awayGroup) {
      isUpset = true; // Home team is in a weaker group
    } else if (homeGroup < awayGroup) {
      isExpectedWin = true; // Home team is in a stronger group
    }
  } else if (predictedOutcome === "away_win") {
    if (awayGroup > homeGroup) {
      isUpset = true; // Away team is in a weaker group
    } else if (awayGroup < homeGroup) {
      isExpectedWin = true; // Away team is in a stronger group
    }
  }

  let difficulty: "Easy" | "Medium" | "Hard";
  let multiplier: number;
  let explanation: string;

  // Hard: Upset prediction (weaker team beating stronger team)
  if (isUpset && groupDifference >= 2) {
    difficulty = "Hard";
    multiplier = 4.0; // 5 → 20 points
    explanation = `Upset prediction: ${
      homeGroup > awayGroup ? "Home" : "Away"
    } team (Group ${Math.max(homeGroup, awayGroup)}) beating ${
      homeGroup > awayGroup ? "away" : "home"
    } team (Group ${Math.min(homeGroup, awayGroup)})`;
  }
  // Hard: Draw between very different groups
  else if (predictedOutcome === "draw" && groupDifference >= 2) {
    difficulty = "Hard";
    multiplier = 4.0; // 5 → 20 points
    explanation = `Unlikely draw between Group ${homeGroup} and Group ${awayGroup} teams`;
  }
  // Easy: Strong team beating weak team (regardless of home/away)
  else if (isExpectedWin && groupDifference >= 2) {
    difficulty = "Easy";
    multiplier = 2.0; // 5 → 10 points
    explanation = `Expected win: Strong team (Group ${Math.min(
      homeGroup,
      awayGroup
    )}) beating weak team (Group ${Math.max(homeGroup, awayGroup)})`;
  }
  // Easy: Expected outcome between similar groups
  else if (groupDifference <= 1 && !isUpset) {
    difficulty = "Easy";
    multiplier = 2.0; // 5 → 10 points
    explanation = `Expected outcome between similar strength teams (Groups ${homeGroup} vs ${awayGroup})`;
  }
  // Medium: Everything else
  else {
    difficulty = "Medium";
    multiplier = 3.0; // 5 → 15 points
    explanation = `Moderate difficulty prediction`;
  }

  return {
    difficulty,
    multiplier,
    explanation,
  };
}
