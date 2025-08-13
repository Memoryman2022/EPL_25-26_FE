// Team name mapping utility to handle differences between external API and database

// External API team names (from football-data.org)
export const EXTERNAL_API_TEAM_NAMES = {
  "Arsenal FC": "Arsenal",
  "Aston Villa FC": "Aston Villa",
  "AFC Bournemouth": "Bournemouth",
  "Brentford FC": "Brentford",
  "Brighton & Hove Albion FC": "Brighton & Hove Albion",
  "Burnley FC": "Burnley",
  "Chelsea FC": "Chelsea",
  "Crystal Palace FC": "Crystal Palace",
  "Everton FC": "Everton",
  "Fulham FC": "Fulham",
  "Leeds United FC": "Leeds United",
  "Liverpool FC": "Liverpool",
  "Manchester City FC": "Manchester City",
  "Manchester United FC": "Manchester United",
  "Newcastle United FC": "Newcastle United",
  "Nottingham Forest FC": "Nottingham Forest",
  "Sunderland AFC": "Sunderland",
  "Tottenham Hotspur FC": "Tottenham Hotspur",
  "West Ham United FC": "West Ham United",
  "Wolverhampton Wanderers FC": "Wolverhampton Wanderers",
};

// Reverse mapping (database names to external API names)
export const DATABASE_TO_EXTERNAL_API: Record<string, string> = {};
Object.entries(EXTERNAL_API_TEAM_NAMES).forEach(([external, database]) => {
  DATABASE_TO_EXTERNAL_API[database] = external;
});

/**
 * Converts external API team name to database team name
 */
export function externalToDatabaseName(externalName: string): string {
  return EXTERNAL_API_TEAM_NAMES[externalName] || externalName;
}

/**
 * Converts database team name to external API team name
 */
export function databaseToExternalName(databaseName: string): string {
  return DATABASE_TO_EXTERNAL_API[databaseName] || databaseName;
}

/**
 * Normalizes team names for consistent comparison
 */
export function normalizeTeamName(teamName: string): string {
  // Remove common suffixes and normalize
  return teamName
    .replace(/\s+FC$/, "")
    .replace(/\s+AFC$/, "")
    .replace(/\s+United$/, " United")
    .replace(/\s+City$/, " City")
    .trim();
}
