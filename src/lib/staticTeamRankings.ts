/**
 * Static team rankings organized into 4 groups of diminishing strength
 * This replaces the database rankings collection for scoring calculations
 */

export interface TeamRanking {
  name: string;
  rank: number;
  group: number;
}
// All teams ranked from 1-20 (strongest to weakest) Gameweek 1-5
// export const ALL_TEAMS: TeamRanking[] = [
//   { name: "Liverpool", rank: 1, group: 1 },
//   { name: "Arsenal", rank: 2, group: 1 },
//   { name: "Manchester City", rank: 3, group: 1 },
//   { name: "Chelsea", rank: 4, group: 1 },
//   { name: "Manchester United", rank: 5, group: 1 },
//   { name: "Newcastle United", rank: 6, group: 2 },
//   { name: "Tottenham Hotspur", rank: 7, group: 2 },
//   { name: "Aston Villa", rank: 8, group: 2 },
//   { name: "Brighton & Hove Albion", rank: 9, group: 2 },
//   { name: "Bournemouth", rank: 10, group: 2 },
//   { name: "Nottingham Forest", rank: 11, group: 3 },
//   { name: "West Ham United", rank: 12, group: 3 },
//   { name: "Fulham", rank: 13, group: 3 },
//   { name: "Everton", rank: 14, group: 3 },
//   { name: "Crystal Palace", rank: 15, group: 3 },
//   { name: "Brentford", rank: 16, group: 4 },
//   { name: "Sunderland", rank: 17, group: 4 },
//   { name: "Wolverhampton Wanderers", rank: 18, group: 4 },
//   { name: "Leeds United", rank: 19, group: 4 },
//   { name: "Burnley", rank: 20, group: 4 },
// ];

// All teams ranked from 1-20 (strongest to weakest) Gameweek 6-8
// export const ALL_TEAMS: TeamRanking[] = [
//   { name: "Liverpool", rank: 1, group: 1 },
//   { name: "Arsenal", rank: 2, group: 1 },
//   { name: "Tottenham Hotspur", rank: 3, group: 1 },
//   { name: "Bournemouth", rank: 4, group: 1 },
//   { name: "Crystal Palace", rank: 5, group: 1 },
//   { name: "Chelsea", rank: 6, group: 2 },
//   { name: "Sunderland", rank: 7, group: 2 },
//   { name: "Fulham", rank: 8, group: 2 },
//   { name: "Manchester City", rank: 9, group: 2 },
//   { name: "Everton", rank: 10, group: 2 },
//   { name: "Manchester United", rank: 11, group: 3 },
//   { name: "Leeds United", rank: 12, group: 3 },
//   { name: "Newcastle United", rank: 13, group: 3 },
//   { name: "Brighton & Hove Albion", rank: 14, group: 3 },
//   { name: "Nottingham Forest", rank: 15, group: 3 },
//   { name: "Burnley", rank: 16, group: 4 },
//   { name: "Brentford", rank: 17, group: 4 },
//   { name: "Aston Villa", rank: 18, group: 4 },
//   { name: "West Ham United", rank: 19, group: 4 },
//   { name: "Wolverhampton Wanderers", rank: 20, group: 4 },
// ];

// All teams ranked from 1-20 (strongest to weakest) Gameweek 9-11
// export const ALL_TEAMS: TeamRanking[] = [
//   { name: "Arsenal", rank: 1, group: 1 },
//   { name: "Manchester City", rank: 2, group: 1 },
//   { name: "Bournemouth", rank: 3, group: 1 },
//   { name: "Liverpool", rank: 4, group: 1 },
//   { name: "Chelsea", rank: 5, group: 1 },
//   { name: "Tottenham Hotspur", rank: 6, group: 2 },
//   { name: "Sunderland", rank: 7, group: 2 },
//   { name: "Crystal Palace", rank: 8, group: 2 },
//   { name: "Manchester United", rank: 9, group: 2 },
//   { name: "Brighton & Hove Albion", rank: 10, group: 2 },
//   { name: "Aston Villa", rank: 11, group: 3 },
//   { name: "Everton", rank: 12, group: 3 },
//   { name: "Brentford", rank: 13, group: 3 },
//   { name: "Newcastle United", rank: 14, group: 3 },
//   { name: "Fulham", rank: 15, group: 3 },
//   { name: "Leeds United", rank: 16, group: 4 },
//   { name: "Burnley", rank: 17, group: 4 },
//   { name: "Nottingham Forest", rank: 18, group: 4 },
//   { name: "West Ham United", rank: 19, group: 4 },
//   { name: "Wolverhampton Wanderers", rank: 20, group: 4 },
// ];

// All teams ranked from 1-20 (strongest to weakest) Gameweek 12-14
// export const ALL_TEAMS: TeamRanking[] = [
//   { name: "Arsenal", rank: 1, group: 1 },
//   { name: "Manchester City", rank: 2, group: 1 },
//   { name: "Chelsea", rank: 3, group: 1 },
//   { name: "Sunderland", rank: 4, group: 1 },
//   { name: "Tottenham Hotspur", rank: 5, group: 1 },
//   { name: "Aston Villa", rank: 6, group: 2 },
//   { name: "Manchester United", rank: 7, group: 2 },
//   { name: "Liverpool", rank: 8, group: 2 },
//   { name: "Bournemouth", rank: 9, group: 2 },
//   { name: "Crystal Palace", rank: 10, group: 2 },
//   { name: "Brighton & Hove Albion", rank: 11, group: 3 },
//   { name: "Brentford", rank: 12, group: 3 },
//   { name: "Everton", rank: 13, group: 3 },
//   { name: "Newcastle United", rank: 14, group: 3 },
//   { name: "Fulham", rank: 15, group: 3 },
//   { name: "Leeds United", rank: 16, group: 4 },
//   { name: "Burnley", rank: 17, group: 4 },
//   { name: "West Ham United", rank: 18, group: 4 },
//   { name: "Nottingham Forest", rank: 19, group: 4 },
//   { name: "Wolverhampton Wanderers", rank: 20, group: 4 },
// ];

// All teams ranked from 1-20 (strongest to weakest) Gameweek 15-17
// export const ALL_TEAMS: TeamRanking[] = [
//   { name: "Arsenal", rank: 1, group: 1 },
//   { name: "Manchester City", rank: 2, group: 1 },
//   { name: "Aston Villa", rank: 3, group: 1 },
//   { name: "Crystal Palace", rank: 4, group: 1 },
//   { name: "Chelsea", rank: 5, group: 1 },
//   { name: "Manchester United", rank: 6, group: 2 },
//   { name: "Everton", rank: 7, group: 2 },
//   { name: "Brighton & Hove Albion", rank: 8, group: 2 },
//   { name: "Sunderland", rank: 9, group: 2 },
//   { name: "Liverpool", rank: 10, group: 2 },
//   { name: "Tottenham Hotspur", rank: 11, group: 3 },
//   { name: "Newcastle United", rank: 12, group: 3 },
//   { name: "Bournemouth", rank: 13, group: 3 },
//   { name: "Brentford", rank: 14, group: 3 },
//   { name: "Fulham", rank: 15, group: 3 },
//   { name: "Leeds United", rank: 16, group: 4 },
//   { name: "Nottingham Forest", rank: 17, group: 4 },
//   { name: "West Ham United", rank: 18, group: 4 },
//   { name: "Burnley", rank: 19, group: 4 },
//   { name: "Wolverhampton Wanderers", rank: 20, group: 4 },
// ];

// All teams ranked from 1-20 (strongest to weakest) Gameweek 18-20
// export const ALL_TEAMS: TeamRanking[] = [
//   { name: "Arsenal", rank: 1, group: 1 },
//   { name: "Manchester City", rank: 2, group: 1 },
//   { name: "Aston Villa", rank: 3, group: 1 },
//   { name: "Chelsea", rank: 4, group: 1 },
//   { name: "Liverpool", rank: 5, group: 1 },
//   { name: "Sunderland", rank: 6, group: 2 },
//   { name: "Manchester United", rank: 7, group: 2 },
//   { name: "Crystal Palace", rank: 8, group: 2 },
//   { name: "Brighton & Hove Albion", rank: 9, group: 2 },
//   { name: "Everton", rank: 10, group: 2 },
//   { name: "Newcastle United", rank: 11, group: 3 },
//   { name: "Brentford", rank: 12, group: 3 },
//   { name: "Tottenham Hotspur", rank: 13, group: 3 },
//   { name: "Bournemouth", rank: 14, group: 3 },
//   { name: "Fulham", rank: 15, group: 3 },
//   { name: "Leeds United", rank: 16, group: 4 },
//   { name: "Nottingham Forest", rank: 17, group: 4 },
//   { name: "West Ham United", rank: 18, group: 4 },
//   { name: "Burnley", rank: 19, group: 4 },
//   { name: "Wolverhampton Wanderers", rank: 20, group: 4 },
// ];

// All teams ranked from 1-20 (strongest to weakest) Gameweek 21-23
export const ALL_TEAMS: TeamRanking[] = [
  { name: "Arsenal", rank: 1, group: 1 },
  { name: "Manchester City", rank: 2, group: 1 },
  { name: "Aston Villa", rank: 3, group: 1 },
  { name: "Liverpool", rank: 4, group: 1 },
  { name: "Chelsea", rank: 5, group: 1 },
  { name: "Manchester United", rank: 6, group: 2 },
  { name: "Brentford", rank: 7, group: 2 },
  { name: "Sunderland", rank: 8, group: 2 },
  { name: "Newcastle United", rank: 9, group: 2 },
  { name: "Brighton & Hove Albion", rank: 10, group: 2 },
  { name: "Fulham", rank: 11, group: 3 },
  { name: "Everton", rank: 12, group: 3 },
  { name: "Tottenham Hotspur", rank: 13, group: 3 },
  { name: "Crystal Palace", rank: 14, group: 3 },
  { name: "Bournemouth", rank: 15, group: 3 },
  { name: "Leeds United", rank: 16, group: 4 },
  { name: "Nottingham Forest", rank: 17, group: 4 },
  { name: "West Ham United", rank: 18, group: 4 },
  { name: "Burnley", rank: 19, group: 4 },
  { name: "Wolverhampton Wanderers", rank: 20, group: 4 },
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
  // First try exact match
  let team = ALL_TEAMS.find((team) => team.name === teamName);

  // If not found, try with common name variations
  if (!team) {
    // Remove common suffixes like "FC", "AFC", etc.
    const normalizedName = teamName
      .replace(/\s+FC$/, "")
      .replace(/\s+AFC$/, "")
      .trim();

    team = ALL_TEAMS.find((team) => team.name === normalizedName);
  }

  return team;
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
 * - Expected win for strong team (2+ group difference)
 *
 * MODERATELY LIKELY (15 points total):
 * - Same group matchups (0 group difference)
 * - Minor upsets (1 group difference)
 * - Draws between adjacent groups (1 group difference)
 * - Expected win between adjacent groups (1 group difference)
 *
 * UNLIKELY (20 points total):
 * - Major upsets (2+ group difference)
 * - Draws between very different strength teams (2+ group difference)
 */
export function calculateOutcomeLikelihood(
  homeTeam: string,
  awayTeam: string,
  predictedOutcome: "homeWin" | "awayWin" | "draw",
  homeScore: number,
  awayScore: number,
  isCorrectScore: boolean // 👈 pass in whether the user got the exact score right
): {
  likelihood: "likely" | "moderately_likely" | "unlikely" | "very_unlikely";
  points: number; // extra points for correct score (NOT including base 5 for outcome)
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
  if (predictedOutcome === "homeWin" && homeGroup > awayGroup) {
    isUpset = true;
  } else if (predictedOutcome === "awayWin" && awayGroup > homeGroup) {
    isUpset = true;
  }

  let likelihood: "likely" | "moderately_likely" | "unlikely" | "very_unlikely";
  let points: number;
  let explanation: string;

  // Tier 1: UNLIKELY (20 points) - Major upsets & unlikely draws
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
  // Tier 2: LIKELY (10 points) - Expected outcomes between different strength teams
  else if (predictedOutcome !== "draw" && groupDifference >= 2) {
    likelihood = "likely";
    points = 10;
    explanation = `Expected win: Strong team (Group ${Math.min(
      homeGroup,
      awayGroup
    )}) beating weak team (Group ${Math.max(homeGroup, awayGroup)})`;
  }
  // Tier 3: MODERATELY LIKELY (15 points) - Same group matchups & adjacent group matchups
  else {
    likelihood = "moderately_likely";
    points = 15;
    if (groupDifference === 0) {
      explanation = `Same group matchup: Both teams are in Group ${homeGroup}, making this prediction moderately difficult`;
    } else {
      explanation = `Moderate difficulty prediction between adjacent groups (Groups ${homeGroup} vs ${awayGroup})`;
    }
  }

  // NEW STIPULATION: Bump up likelihood for predictions with an excess of 3 goals
  // Ensure scores are numbers for calculation
  const totalGoals = Math.abs(Number(homeScore) + Number(awayScore));
  if (totalGoals > 3) {
    const originalLikelihood = likelihood;
    if (likelihood === "likely") {
      likelihood = "moderately_likely";
      points = 15;
    } else if (likelihood === "moderately_likely") {
      likelihood = "unlikely";
      points = 20;
    } else if (likelihood === "unlikely") {
      likelihood = "very_unlikely";
      points = 25;
    } else if (likelihood === "very_unlikely") {
      // Already at highest tier, stay there
      points = 25;
    }
    explanation += `. Additionally, the large goal total (${totalGoals}) bumped the likelihood from '${originalLikelihood}' to '${likelihood}'`;
  }

  return {
    likelihood,
    points,
    explanation,
  };
}
