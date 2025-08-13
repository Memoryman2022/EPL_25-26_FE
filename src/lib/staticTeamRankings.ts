/**
 * Static team rankings organized into 4 groups of diminishing strength
 * This replaces the database rankings collection for scoring calculations
 */

export interface TeamRanking {
  name: string;
  rank: number;
  group: number;
}

// All teams ranked from 1-20 (strongest to weakest)
export const ALL_TEAMS: TeamRanking[] = [
  { name: "Liverpool", rank: 1, group: 1 },
  { name: "Arsenal", rank: 2, group: 1 },
  { name: "Manchester City", rank: 3, group: 1 },
  { name: "Chelsea", rank: 4, group: 1 },
  { name: "Manchester United", rank: 5, group: 1 },
  { name: "Tottenham Hotspur", rank: 6, group: 2 },
  { name: "Newcastle United", rank: 7, group: 2 },
  { name: "Aston Villa", rank: 8, group: 2 },
  { name: "Crystal Palace", rank: 9, group: 2 },
  { name: "Brighton & Hove Albion", rank: 10, group: 2 },
  { name: "West Ham United", rank: 11, group: 3 },
  { name: "Brentford", rank: 12, group: 3 },
  { name: "Fulham", rank: 13, group: 3 },
  { name: "Nottingham Forest", rank: 14, group: 3 },
  { name: "Wolverhampton Wanderers", rank: 15, group: 3 },
  { name: "Everton", rank: 16, group: 4 },
  { name: "Bournemouth", rank: 17, group: 4 },
  { name: "Leeds United", rank: 18, group: 4 },
  { name: "Burnley", rank: 19, group: 4 },
  { name: "Sunderland", rank: 20, group: 4 },
];

// Group definitions for easy reference
export const TEAM_GROUPS = {
  G1: ALL_TEAMS.filter((team) => team.group === 1), // Ranks 1-5 (Top tier)
  G2: ALL_TEAMS.filter((team) => team.group === 2), // Ranks 6-10 (Upper middle)
  G3: ALL_TEAMS.filter((team) => team.group === 3), // Ranks 11-15 (Lower middle)
  G4: ALL_TEAMS.filter((team) => team.group === 4), // Ranks 16-20 (Bottom tier)
};

// Helper function to get team ranking by name
export function getTeamRanking(teamName: string): TeamRanking | undefined {
  return ALL_TEAMS.find((team) => team.name === teamName);
}

// Helper function to get team group by name
export function getTeamGroup(teamName: string): number {
  const team = getTeamRanking(teamName);
  return team?.group || 4; // Default to group 4 if team not found
}

/**
 * Simplified scoring system based on outcome likelihood
 *
 * LIKELIHOOD DEGREES:
 *
 * LIKELY (10 points total):
 * - Strong team beating weak team (2+ group difference)
 * - Similar strength teams (0-1 group difference) - any outcome
 *
 * MODERATELY LIKELY (15 points total):
 * - Minor upsets (1 group difference)
 * - Close matches between adjacent groups
 *
 * UNLIKELY (20 points total):
 * - Major upsets (2+ group difference)
 * - Draws between very different strength teams
 * - Bottom group beating top group
 */
export function calculateOutcomeLikelihood(
  homeTeam: string,
  awayTeam: string,
  predictedOutcome: "home_win" | "away_win" | "draw"
): {
  likelihood: "likely" | "moderately_likely" | "unlikely";
  points: number;
  explanation: string;
} {
  const homeRanking = getTeamRanking(homeTeam);
  const awayRanking = getTeamRanking(awayTeam);

  if (!homeRanking || !awayRanking) {
    return {
      likelihood: "moderately_likely",
      points: 15,
      explanation: "Team ranking not found, defaulting to moderate difficulty",
    };
  }

  const homeGroup = homeRanking.group;
  const awayGroup = awayRanking.group;
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

  let likelihood: "likely" | "moderately_likely" | "unlikely";
  let points: number;
  let explanation: string;

  // UNLIKELY (20 points): Major upsets and unlikely draws
  if (isUpset && groupDifference >= 2) {
    likelihood = "unlikely";
    points = 20;
    explanation = `Major upset: ${
      homeGroup > awayGroup ? "Home" : "Away"
    } team (Group ${Math.max(homeGroup, awayGroup)}) beating ${
      homeGroup > awayGroup ? "away" : "home"
    } team (Group ${Math.min(homeGroup, awayGroup)})`;
  } else if (predictedOutcome === "draw" && groupDifference >= 2) {
    likelihood = "unlikely";
    points = 20;
    explanation = `Unlikely draw between Group ${homeGroup} and Group ${awayGroup} teams`;
  }
  // LIKELY (10 points): Expected outcomes
  else if (isExpectedWin && groupDifference >= 2) {
    likelihood = "likely";
    points = 10;
    explanation = `Expected win: Strong team (Group ${Math.min(
      homeGroup,
      awayGroup
    )}) beating weak team (Group ${Math.max(homeGroup, awayGroup)})`;
  } else if (groupDifference <= 1 && !isUpset) {
    likelihood = "likely";
    points = 10;
    explanation = `Expected outcome between similar strength teams (Groups ${homeGroup} vs ${awayGroup})`;
  }
  // MODERATELY LIKELY (15 points): Everything else
  else {
    likelihood = "moderately_likely";
    points = 15;
    explanation = `Moderate difficulty prediction`;
  }

  return {
    likelihood,
    points,
    explanation,
  };
}
