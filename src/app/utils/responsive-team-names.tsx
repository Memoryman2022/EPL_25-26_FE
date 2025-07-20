"use client";

import React, { useState, useEffect } from "react";

// Utility function: Truncate long team names
const truncateTeamName = (name: string): string => {
  const cleanedName = name.replace(
    /(^\s*FC\s*)|(\s*FC\s*$)|(^\s*AFC\s*)|(\s*AFC\s*$)/gi,
    ""
  );

  const words = cleanedName.split(" ");

  if (words[0] === "West") return "West Ham";
  if (words.slice(0, 2).join(" ") === "Manchester United") return "Man Utd";
  if (words.slice(0, 2).join(" ") === "Manchester City") return "Man City";
  if (words.slice(0, 2).join(" ") === "Nottingham Forest") return "Forest";
  if (words.slice(0, 2).join(" ") === "Crystal Palace") return "Palace";
  if (words[0] === "Wolverhampton") return "Wolves";

  const exceptions = ["Aston", "West"];
  if (exceptions.includes(words[0])) return cleanedName;

  return words[0]; // default to first word
};

// Component
type Props = {
  name: string;
};

const ResponsiveTeamName = ({ name }: Props) => {
  const [truncatedName, setTruncatedName] = useState(name);

  useEffect(() => {
    setTruncatedName(truncateTeamName(name));
  }, [name]);

  return <span className="text-shadow">{truncatedName}</span>;
};

export default ResponsiveTeamName;
