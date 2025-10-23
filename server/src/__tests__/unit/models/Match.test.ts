import Match from "../../../models/Match.js";

describe("Match model", () => {
  describe("Validation", () => {
    it("should create a valid match", async () => {
      const matchData = {
        apiId: 12345,
        homeTeam: "Manchester United",
        awayTeam: "Liverpool",
        homeScore: 2,
        awayScore: 1,
        league: "Premier League",
        status: "finished",
        startTime: new Date(),
        venue: "Old Trafford",
      };

      const match = new Match(matchData);
      const savedMatch = await match.save();

      expect(savedMatch._id).toBeDefined();
      expect(savedMatch.homeTeam).toBe("Manchester United");
      expect(savedMatch.awayTeam).toBe("Liverpool");
      expect(savedMatch.homeScore).toBe(2);
      expect(savedMatch.status).toBe("finished");
    });

    it("should fail without required fields", async () => {
      const match = new Match({
        homeTeam: "Arsenal",
        //...
      });

      await expect(match.save()).rejects.toThrow();
    });
  });

  describe("Queries", () => {
    beforeEach(async () => {
      await Match.create([
        {
          apiId: 1,
          homeTeam: "Team A",
          awayTeam: "Team B",
          homeScore: 2,
          awayScore: 1,
          league: "Premier League",
          status: "live",
          startTime: new Date(),
          venue: "Stadium A",
        },
        {
          apiId: 2,
          homeTeam: "Team C",
          awayTeam: "Team D",
          homeScore: 0,
          awayScore: 0,
          league: "La Liga",
          status: "scheduled",
          startTime: new Date(),
          venue: "Stadium B",
        },
      ]);
    });

    it("should find matches by status", async () => {
      const liveMatches = await Match.find({ status: "live" });
      expect(liveMatches).toHaveLength(1);
      expect(liveMatches[0]!.homeTeam).toBe("Team A");
    });

    it("should find matches by league", async () => {
      const plMatches = await Match.find({ league: "Premier League" });

      expect(plMatches).toHaveLength(1);
      expect(plMatches[0]!.league).toBe("Premier League");
    });
  });
});
