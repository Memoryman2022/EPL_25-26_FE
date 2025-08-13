// This interface should match the structure of your database documents.
export interface Team {
  name: string;
  rank: number;
  points: number;
  goalDifference: number;
  goalsFor: number;
  goalsAgainst: number;
  matchesPlayed: number;
}

// Interface for the grouped teams output
export interface TeamGroups {
  G1: Team[]; // Ranks 1-5
  G2: Team[]; // Ranks 6-10
  G3: Team[]; // Ranks 11-15
  G4: Team[]; // Ranks 16-20
}

/**
 * Groups a list of teams into four tiers based on their rank.
 * @param teams An array of all 20 team objects.
 * @returns An object containing the four groups (G1, G2, G3, G4).
 */
export function groupTeams(teams: Team[]): TeamGroups {
  const G1: Team[] = [];
  const G2: Team[] = [];
  const G3: Team[] = [];
  const G4: Team[] = [];

  // Assuming the teams array is already sorted by rank (1-20)
  // If not, you should sort it first: teams.sort((a, b) => a.rank - b.rank);

  for (const team of teams) {
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
