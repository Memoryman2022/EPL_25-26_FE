describe("Scoring API", () => {
  it("returns correct points for same-group, low scoring draw (correct score)", () => {
    cy.request("POST", "/api/test-scoring", {
      result: {
        fixtureId: 1,
        homeTeam: { name: "Aston Villa" },
        awayTeam: { name: "Burnley" },
        score: { fullTime: { home: 1, away: 1 }, winner: "DRAW" },
      },
      prediction: {
        fixtureId: 1,
        userId: "user1",
        homeScore: 1,
        awayScore: 1,
        outcome: "draw",
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.totalPoints).to.equal(20);
      expect(response.body.explanation).to.include("unlikely");
    });
  });

  it("returns correct points for same-group, high scoring draw (correct score)", () => {
    cy.request("POST", "/api/test-scoring", {
      result: {
        fixtureId: 2,
        homeTeam: { name: "Aston Villa" },
        awayTeam: { name: "Burnley" },
        score: { fullTime: { home: 2, away: 2 }, winner: "DRAW" },
      },
      prediction: {
        fixtureId: 2,
        userId: "user1",
        homeScore: 2,
        awayScore: 2,
        outcome: "draw",
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.totalPoints).to.equal(25);
      expect(response.body.explanation).to.include("very_unlikely");
    });
  });

  it("returns correct points for adjacent group, low scoring (correct score)", () => {
    cy.request("POST", "/api/test-scoring", {
      result: {
        fixtureId: 3,
        homeTeam: { name: "Chelsea" },
        awayTeam: { name: "Manchester United" },
        score: { fullTime: { home: 1, away: 0 }, winner: "HOME_TEAM" },
      },
      prediction: {
        fixtureId: 3,
        userId: "user1",
        homeScore: 1,
        awayScore: 0,
        outcome: "homeWin",
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.totalPoints).to.equal(15);
      expect(response.body.explanation).to.include("moderately_likely");
    });
  });

  it("returns correct points for adjacent group, high scoring (correct score)", () => {
    cy.request("POST", "/api/test-scoring", {
      result: {
        fixtureId: 4,
        homeTeam: { name: "Chelsea" },
        awayTeam: { name: "Manchester United" },
        score: { fullTime: { home: 3, away: 2 }, winner: "HOME_TEAM" },
      },
      prediction: {
        fixtureId: 4,
        userId: "user1",
        homeScore: 3,
        awayScore: 2,
        outcome: "homeWin",
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.totalPoints).to.equal(20);
      expect(response.body.explanation).to.include("unlikely");
    });
  });

  it("returns correct points for large group diff, expected win (correct score)", () => {
    cy.request("POST", "/api/test-scoring", {
      result: {
        fixtureId: 5,
        homeTeam: { name: "Liverpool" },
        awayTeam: { name: "Wolverhampton Wanderers" },
        score: { fullTime: { home: 2, away: 0 }, winner: "HOME_TEAM" },
      },
      prediction: {
        fixtureId: 5,
        userId: "user1",
        homeScore: 2,
        awayScore: 0,
        outcome: "homeWin",
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.totalPoints).to.equal(10);
      expect(response.body.explanation).to.include("likely");
    });
  });

  it("returns correct points for large group diff, upset (correct score)", () => {
    cy.request("POST", "/api/test-scoring", {
      result: {
        fixtureId: 6,
        homeTeam: { name: "Wolverhampton Wanderers" },
        awayTeam: { name: "Liverpool" },
        score: { fullTime: { home: 2, away: 1 }, winner: "HOME_TEAM" },
      },
      prediction: {
        fixtureId: 6,
        userId: "user1",
        homeScore: 2,
        awayScore: 1,
        outcome: "homeWin",
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.totalPoints).to.equal(20);
      expect(response.body.explanation).to.include("unlikely");
    });
  });

  it("returns correct points for large group diff, high scoring upset (correct score)", () => {
    cy.request("POST", "/api/test-scoring", {
      result: {
        fixtureId: 7,
        homeTeam: { name: "Wolverhampton Wanderers" },
        awayTeam: { name: "Liverpool" },
        score: { fullTime: { home: 4, away: 3 }, winner: "HOME_TEAM" },
      },
      prediction: {
        fixtureId: 7,
        userId: "user1",
        homeScore: 4,
        awayScore: 3,
        outcome: "homeWin",
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.totalPoints).to.equal(25);
      expect(response.body.explanation).to.include("very_unlikely");
    });
  });

  it("returns correct points for large group diff, draw (correct score)", () => {
    cy.request("POST", "/api/test-scoring", {
      result: {
        fixtureId: 8,
        homeTeam: { name: "Liverpool" },
        awayTeam: { name: "Wolverhampton Wanderers" },
        score: { fullTime: { home: 1, away: 1 }, winner: "DRAW" },
      },
      prediction: {
        fixtureId: 8,
        userId: "user1",
        homeScore: 1,
        awayScore: 1,
        outcome: "draw",
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.totalPoints).to.equal(20);
      expect(response.body.explanation).to.include("unlikely");
    });
  });

  it("returns correct points for large group diff, high scoring draw (correct score)", () => {
    cy.request("POST", "/api/test-scoring", {
      result: {
        fixtureId: 9,
        homeTeam: { name: "Liverpool" },
        awayTeam: { name: "Wolverhampton Wanderers" },
        score: { fullTime: { home: 3, away: 3 }, winner: "DRAW" },
      },
      prediction: {
        fixtureId: 9,
        userId: "user1",
        homeScore: 3,
        awayScore: 3,
        outcome: "draw",
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.totalPoints).to.equal(25);
      expect(response.body.explanation).to.include("very_unlikely");
    });
  });

  it("returns 0 points for completely wrong prediction (wrong outcome)", () => {
    cy.request("POST", "/api/test-scoring", {
      result: {
        fixtureId: 10,
        homeTeam: { name: "Liverpool" },
        awayTeam: { name: "Wolverhampton Wanderers" },
        score: { fullTime: { home: 2, away: 0 }, winner: "HOME_TEAM" },
      },
      prediction: {
        fixtureId: 10,
        userId: "user1",
        homeScore: 0,
        awayScore: 2,
        outcome: "awayWin",
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.totalPoints).to.equal(0);
      expect(response.body.outcomeCorrect).to.equal(false);
    });
  });

  it("returns 5 points for correct outcome but wrong score", () => {
    cy.request("POST", "/api/test-scoring", {
      result: {
        fixtureId: 11,
        homeTeam: { name: "Liverpool" },
        awayTeam: { name: "Wolverhampton Wanderers" },
        score: { fullTime: { home: 2, away: 0 }, winner: "HOME_TEAM" },
      },
      prediction: {
        fixtureId: 11,
        userId: "user1",
        homeScore: 3,
        awayScore: 1,
        outcome: "homeWin",
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.totalPoints).to.equal(5);
      expect(response.body.outcomeCorrect).to.equal(true);
      expect(response.body.scoreCorrect).to.equal(false);
    });
  });
});
