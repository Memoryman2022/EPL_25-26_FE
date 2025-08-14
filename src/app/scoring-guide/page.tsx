
import React from 'react';

/**
 * A guide component explaining the scoring system for users.
 * This can be placed on a dedicated page or in a modal on your website.
 */
export default function ScoringGuide() {
  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg text-gray-100 space-y-6">
      <h2 className="text-xl font-bold text-center text-white">
        Understanding the Prediction Scoring System
      </h2>
      <p className="text-center text-gray-300">
        Our scoring system is designed to reward predictions that are not only correct, but also bold and difficult to get right. Points are awarded based on a prediction's likelihood, with more unlikely outcomes earning you more points.
      </p>

      <hr className="border-gray-700" />

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Team Groups and Rankings</h3>
        <p>
          To simplify the scoring, all 20 teams are divided into four groups based on their strength and pre-season expectations.
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li><strong>Group 1 (G1):</strong> The 5 strongest teams (e.g., Liverpool, Arsenal)</li>
          <li><strong>Group 2 (G2):</strong> The next 5 strongest teams</li>
          <li><strong>Group 3 (G3):</strong> The next 5 strongest teams</li>
          <li><strong>Group 4 (G4):</strong> The 5 weakest teams (e.g., Everton, Sunderland)</li>
        </ul>
        <p className="mt-2">
          The <strong>group</strong> of each team is the main factor in determining how many points your prediction is worth.
        </p>
      </section>

      <hr className="border-gray-700" />

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">How Your Prediction is Scored</h3>
        <p>
          When you submit a prediction, our system calculates its difficulty and assigns it one of three point values.
        </p>

        <h4 className="text-lg font-bold text-green-400">Tier 1: Likely Outcomes (10 Points)</h4>
        <p>
          This is the standard score for predictions that are considered the most probable. You will earn <strong>10 points</strong> if you correctly predict:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li><strong>An Expected Win:</strong> A stronger team (with a group difference of 2 or more) beats a much weaker team. For example, a G1 team beating a G4 team.</li>
          <li><strong>Any Outcome Between Similar Teams:</strong> Any result—win, loss, or draw—in a match between teams of similar strength (with a group difference of 0). For example, a G2 team playing a G2 team.</li>
        </ul>

        <h4 className="text-lg font-bold text-yellow-400 mt-6">Tier 2: Moderately Likely Outcomes (15 Points)</h4>
        <p>
          This tier rewards predictions that are a bit more difficult. You will earn <strong>15 points</strong> if you correctly predict:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li><strong>An Outcome Between Adjacent Groups:</strong> Any win, loss, or draw in a match between teams from adjacent groups (with a group difference of 1). This covers minor upsets (like a G2 team beating a G1 team) as well as close matches and draws between these teams.</li>
        </ul>

        <h4 className="text-lg font-bold text-red-400 mt-6">Tier 3: Unlikely Outcomes (20 Points)</h4>
        <p>
          This is the highest-scoring tier, reserved for the most difficult and boldest predictions. You will earn <strong>20 points</strong> if you correctly predict:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li><strong>A Major Upset:</strong> A team from a weaker group (with a group difference of 2 or more) beats a much stronger team. For example, a G3 team beating a G1 team.</li>
          <li><strong>A Draw Between Dissimilar Teams:</strong> A draw in a match between two teams of vastly different strengths (with a group difference of 2 or more). For example, a G1 team drawing with a G3 team.</li>
        </ul>
      </section>

      <hr className="border-gray-700" />

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">The Total Goals Bonus</h3>
        <p>
          There is one final rule that can boost your score. If the <strong>total number of goals in your prediction is more than 3</strong>, your prediction's score will be "bumped up" to the next tier of difficulty.
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>A <strong>Likely</strong> prediction (10 points) becomes a <strong>Moderately Likely</strong> prediction (15 points).</li>
          <li>A <strong>Moderately Likely</strong> prediction (15 points) becomes an <strong>Unlikely</strong> prediction (20 points).</li>
          <li>An <strong>Unlikely</strong> prediction (20 points) remains an <strong>Unlikely</strong> prediction (it cannot be bumped up further).</li>
        </ul>
        <p className="mt-2 text-sm text-gray-400">
          For example, if you predict a G1 vs. G4 match to be 3-1, your prediction would normally be "Likely" and worth 10 points. However, because the total goals are 4 (which is more than 3), the difficulty is bumped up, and your prediction is now worth 15 points.
        </p>
      </section>
    </div>
  );
}
