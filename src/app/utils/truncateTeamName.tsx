export const truncateTeamName = (name: string): string => {
  // Remove prefixes or suffixes "FC" or "AFC"
  const cleanedName = name.replace(
    /(^\s*FC\s*)|(\s*FC\s*$)|(^\s*AFC\s*)|(\s*AFC\s*$)/gi,
    ""
  );

  // Split the cleaned name into words
  const words = cleanedName.split(" ");

  // Check if the first word matches the exceptions
  const exceptions = ["Aston", "Crystal", "West"];

  if (words[0] === "West") {
    return "West Ham";
  }

  if (words.slice(0, 2).join(" ") === "Manchester United") {
    return "Man Utd";
  }

  if (words.slice(0, 2).join(" ") === "Manchester City") {
    return "Man City";
  }

  if (words.slice(0, 2).join(" ") === "Nottingham Forest") {
    return "Forest";
  }

  if (words[0] === "Wolverhampton") {
    return "Wolves";
  }

  // Return the full name for exceptions or the first word otherwise
  if (exceptions.includes(words[0])) {
    return cleanedName;
  }

  // Return only the first word if not an exception
  return words[0];
};
