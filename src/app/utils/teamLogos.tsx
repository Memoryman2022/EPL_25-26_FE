// src/utils/teamLogos.ts
export const teamNameToImageMap: Record<string, string> = {
    "Arsenal FC": "Arsenal.png",
    "Aston Villa FC": "Aston Villa.png",
    "AFC Bournemouth": "Bournemouth.png",
    "Brentford FC": "Brentford.png",
    "Brighton & Hove Albion FC": "Brighton.png",
    "Burnley FC": "Burnley.png",
    "Chelsea FC": "Chelsea.png",
    "Crystal Palace FC": "Crystal Palace.png",
    "Everton FC": "Everton.png",
    "Fulham FC": "Fulham.png",
    "Leeds United FC": "Leeds.png",
    "Liverpool FC": "Liverpool.png",
    "Manchester City FC": "Manchester City.png",
    "Manchester United FC": "Manchester United.png",
    "Newcastle United FC": "Newcastle United.png",
    "Nottingham Forest FC": "Nottm Forest.png",
    "Sunderland AFC": "Sunderland.png",
    "Tottenham Hotspur FC": "Tottenham Hotspur.png",
    "West Ham United FC": "West Ham United.png",
    "Wolverhampton Wanderers FC": "Wolves.png",
  };
  
  export function getTeamImage(teamName: string): string {
    return `/teams/${teamNameToImageMap[teamName] || "default.png"}`;
  }
  