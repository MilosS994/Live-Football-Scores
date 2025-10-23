import request from "supertest";
import express, { Express } from "express";
import matchRoutes from "../../../routes/match.routes.js";
import Match from "../../../models/Match.js";
import { errorMiddleware } from "../../../middlewares/error.middleware.js";

const createTestApp = (): Express => {
  const app = express();
  app.use(express.json());
  app.use("/api/v1/matches", matchRoutes);
  app.use(errorMiddleware);
  return app;
};

describe("Matches API Integration Tests", () => {
  let app: Express;

  beforeAll(() => {
    app = createTestApp();
  });

  // Seed test data before each test
  beforeEach(async () => {
    await Match.create([
      {
        apiId: 100,
        homeTeam: "Manchester United",
        awayTeam: "Liverpool",
        homeScore: 2,
        awayScore: 1,
        league: "Premier League",
        status: "finished",
        startTime: new Date("2024-10-20T15:00:00Z"),
        venue: "Old Trafford",
      },
      {
        apiId: 101,
        homeTeam: "Barcelona",
        awayTeam: "Real Madrid",
        homeScore: 1,
        awayScore: 1,
        league: "La Liga",
        status: "live",
        startTime: new Date("2024-10-23T20:00:00Z"),
        venue: "Camp Nou",
      },
      {
        apiId: 102,
        homeTeam: "Bayern Munich",
        awayTeam: "Borussia Dortmund",
        homeScore: 0,
        awayScore: 0,
        league: "Bundesliga",
        status: "scheduled",
        startTime: new Date("2024-10-25T18:30:00Z"),
        venue: "Allianz Arena",
      },
    ]);
  });

  describe("GET /api/v1/matches", () => {
    it("should return all matches", async () => {
      const response = await request(app).get("/api/v1/matches").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.matches).toHaveLength(3);
      expect(response.body.count).toBe(3);
    });

    it("should filter matches by status=live", async () => {
      const response = await request(app)
        .get("/api/v1/matches?status=live")
        .expect(200);

      expect(response.body.matches).toHaveLength(1);
      expect(response.body.matches[0].status).toBe("live");
      expect(response.body.matches[0].homeTeam).toBe("Barcelona");
    });

    it("should filter matches by status=finished", async () => {
      const response = await request(app)
        .get("/api/v1/matches?status=finished")
        .expect(200);

      expect(response.body.matches).toHaveLength(1);
      expect(response.body.matches[0].homeTeam).toBe("Manchester United");
    });

    it("should filter matches by status=scheduled", async () => {
      const response = await request(app)
        .get("/api/v1/matches?status=scheduled")
        .expect(200);

      expect(response.body.matches).toHaveLength(1);
      expect(response.body.matches[0].homeTeam).toBe("Bayern Munich");
    });

    it("should filter matches by league", async () => {
      const response = await request(app)
        .get("/api/v1/matches?league=Premier League")
        .expect(200);

      expect(response.body.matches).toHaveLength(1);
      expect(response.body.matches[0].league).toBe("Premier League");
    });

    it("should limit results with limit parameter", async () => {
      const response = await request(app)
        .get("/api/v1/matches?limit=2")
        .expect(200);

      expect(response.body.matches.length).toBeLessThanOrEqual(2);
    });

    it("should return empty array when no matches found", async () => {
      await Match.deleteMany({}); // Delete all matches first

      const response = await request(app).get("/api/v1/matches").expect(200);

      expect(response.body.matches).toHaveLength(0);
      expect(response.body.count).toBe(0);
    });
  });

  describe("GET /api/v1/matches/:id", () => {
    it("should return a single match by ID", async () => {
      const match = await Match.findOne({ apiId: 100 });

      const response = await request(app)
        .get(`/api/v1/matches/${match!._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.match.homeTeam).toBe("Manchester United");
      expect(response.body.match.awayTeam).toBe("Liverpool");
    });

    it("should return 404 for non-existent match", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .get(`/api/v1/matches/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    it("should return 400 for invalid ID format", async () => {
      const response = await request(app)
        .get("/api/v1/matches/invalid-id-format")
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
