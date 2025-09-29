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
        setLoading(false);
        return;
      }

      // Collect all fixtureIds as strings
      const fixtureIds: string[] = results.map((result: any) =>
        String(result.fixtureId)
      );

      // Make a single API call to update all predictions and scores
      const updateRes = await fetch("/api/predictions/update-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fixtureIds }), // array of strings
      });

      const data = await updateRes.json();

      if (updateRes.ok) {
        console.log(`Batch updated: ${data.updated} predictions`);
        alert(
          `Updated ${data.updated} predictions and user scores successfully.`
        );
      } else {
        console.error("Error updating predictions:", data.error);
        alert("Failed to update predictions.");
      }
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
