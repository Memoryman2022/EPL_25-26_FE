const { calculatePredictionPoints } = require('../src/models/scoring');

const scenarios = [
  // Same group, low scoring
  {
    desc: 'Same group, low scoring (1:1)',
    result: {
      fixtureId: 1,
      homeTeam: { name: 'Aston Villa' },
      awayTeam: { name: 'Burnley' },
      score: { fullTime: { home: 1, away: 1 }, winner: 'DRAW' },
    },
    prediction: {
      fixtureId: 1,
      userId: 'user1',
      homeScore: 1,
      awayScore: 1,
      outcome: 'draw',
    },
  },
  // Same group, high scoring
  {
    desc: 'Same group, high scoring (2:2)',
    result: {
      fixtureId: 2,
      homeTeam: { name: 'Aston Villa' },
      awayTeam: { name: 'Burnley' },
      score: { fullTime: { home: 2, away: 2 }, winner: 'DRAW' },
    },
    prediction: {
      fixtureId: 2,
      userId: 'user1',
      homeScore: 2,
      awayScore: 2,
      outcome: 'draw',
    },
  },
  // Adjacent group, low scoring
  {
    desc: 'Adjacent group, low scoring (Chelsea vs Man United, 1:0)',
    result: {
      fixtureId: 3,
      homeTeam: { name: 'Chelsea' },
      awayTeam: { name: 'Manchester United' },
      score: { fullTime: { home: 1, away: 0 }, winner: 'HOME_TEAM' },
    },
    prediction: {
      fixtureId: 3,
      userId: 'user1',
      homeScore: 1,
      awayScore: 0,
      outcome: 'homeWin',
    },
  },
  // Adjacent group, high scoring
  {
    desc: 'Adjacent group, high scoring (Chelsea vs Man United, 3:2)',
    result: {
      fixtureId: 4,
      homeTeam: { name: 'Chelsea' },
      awayTeam: { name: 'Manchester United' },
      score: { fullTime: { home: 3, away: 2 }, winner: 'HOME_TEAM' },
    },
    prediction: {
      fixtureId: 4,
      userId: 'user1',
      homeScore: 3,
      awayScore: 2,
      outcome: 'homeWin',
    },
  },
  // Large group difference, expected win
  {
    desc: 'Large group diff, expected win (Liverpool vs Wolves, 2:0)',
    result: {
      fixtureId: 5,
      homeTeam: { name: 'Liverpool' },
      awayTeam: { name: 'Wolverhampton Wanderers' },
      score: { fullTime: { home: 2, away: 0 }, winner: 'HOME_TEAM' },
    },
    prediction: {
      fixtureId: 5,
      userId: 'user1',
      homeScore: 2,
      awayScore: 0,
      outcome: 'homeWin',
    },
  },
  // Large group difference, upset
  {
    desc: 'Large group diff, upset (Wolves vs Liverpool, 2:1)',
    result: {
      fixtureId: 6,
      homeTeam: { name: 'Wolverhampton Wanderers' },
      awayTeam: { name: 'Liverpool' },
      score: { fullTime: { home: 2, away: 1 }, winner: 'HOME_TEAM' },
    },
    prediction: {
      fixtureId: 6,
      userId: 'user1',
      homeScore: 2,
      awayScore: 1,
      outcome: 'homeWin',
    },
  },
  // Large group difference, high scoring upset
  {
    desc: 'Large group diff, high scoring upset (Wolves vs Liverpool, 4:3)',
    result: {
      fixtureId: 7,
      homeTeam: { name: 'Wolverhampton Wanderers' },
      awayTeam: { name: 'Liverpool' },
      score: { fullTime: { home: 4, away: 3 }, winner: 'HOME_TEAM' },
    },
    prediction: {
      fixtureId: 7,
      userId: 'user1',
      homeScore: 4,
      awayScore: 3,
      outcome: 'homeWin',
    },
  },
  // Large group difference, draw
  {
    desc: 'Large group diff, draw (Liverpool vs Wolves, 1:1)',
    result: {
      fixtureId: 8,
      homeTeam: { name: 'Liverpool' },
      awayTeam: { name: 'Wolverhampton Wanderers' },
      score: { fullTime: { home: 1, away: 1 }, winner: 'DRAW' },
    },
    prediction: {
      fixtureId: 8,
      userId: 'user1',
      homeScore: 1,
      awayScore: 1,
      outcome: 'draw',
    },
  },
  // Large group difference, high scoring draw
  {
    desc: 'Large group diff, high scoring draw (Liverpool vs Wolves, 3:3)',
    result: {
      fixtureId: 9,
      homeTeam: { name: 'Liverpool' },
      awayTeam: { name: 'Wolverhampton Wanderers' },
      score: { fullTime: { home: 3, away: 3 }, winner: 'DRAW' },
    },
    prediction: {
      fixtureId: 9,
      userId: 'user1',
      homeScore: 3,
      awayScore: 3,
      outcome: 'draw',
    },
  },
];

const mockUser = {
  _id: 'user1',
  name: 'Test User',
  score: 0,
  correctOutcomes: 0,
  correctScores: 0,
};

console.log('--- SCORING SYSTEM TESTS ---');

scenarios.forEach(({ desc, result, prediction }) => {
  const userBefore = { ...mockUser };
  const pointsData = calculatePredictionPoints(result, prediction);
  const userAfter = { ...userBefore };
  userAfter.score += pointsData.totalPoints;
  if (pointsData.outcomeCorrect) userAfter.correctOutcomes += 1;
  if (pointsData.scoreCorrect) userAfter.correctScores += 1;

  console.log(`\nScenario: ${desc}`);
  console.log('Prediction:', prediction);
  console.log('Result:', result);
  console.log('Points Data:', pointsData);
  console.log('User Before:', userBefore);
  console.log('User After:', userAfter);
});

console.log('\n--- END OF TESTS ---');
