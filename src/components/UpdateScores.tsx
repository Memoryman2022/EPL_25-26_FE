"use client";

import { useState } from "react";

export default function UpdateScoresButton() {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      console.log("Fetching all results from /api/results...");
      const resultsRes = await fetch("/api/results");
      if (!resultsRes.ok) throw new Error("Failed to fetch results");

      const results = await resultsRes.json();
      console.log("Results received:", results);

      if (!Array.isArray(results) || results.length === 0) {
        console.warn("No results returned from API.");
        alert("No results found to update predictions.");
        return;
      }

      let totalUpdated = 0;

      for (const result of results) {
        console.log("Updating predictions for fixtureId:", result.fixtureId);

        const updateRes = await fetch("/api/predictions/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fixtureId: result.fixtureId }), // make sure this is a number
        });
        console.log(
          "Sending fixtureId to update:",
          result.fixtureId,
          typeof result.fixtureId
        );

        const data = await updateRes.json();

        if (updateRes.ok) {
          console.log(
            `Updated ${data.updated} predictions for fixtureId ${result.fixtureId}`
          );
          totalUpdated += data.updated || 0;
        } else {
          console.error(
            `Error updating fixtureId ${result.fixtureId}:`,
            data.error
          );
        }
      }

      console.log(`Total predictions updated: ${totalUpdated}`);
      alert(
        `Updated ${totalUpdated} predictions and user scores successfully.`
      );
    } catch (err) {
      console.error("Error during update:", err);
      alert("Failed to update predictions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-100px"
      onClick={handleUpdate}
      disabled={loading}
    >
      {loading ? "Updating..." : "Update Scores"}
    </button>
  );
}
