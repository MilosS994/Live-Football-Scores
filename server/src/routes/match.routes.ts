import express from "express";
import * as matchControllers from "../controllers/match.controller.js";
import * as validators from "../validators/match.validators.js";

const router = express.Router();

// Get all matches
router.get("/", matchControllers.getAllMatches);

// Get live matches
router.get("/live", matchControllers.getLiveMatches);

// Get scheduled matches
router.get("/scheduled", matchControllers.getScheduledMatches);

// Get finished matches
router.get("/finished", matchControllers.getFinishedMatches);

// Get a single match by ID
router.get("/:matchId", validators.idValidator, matchControllers.getMatch);

// Create a new match
router.post("/", validators.createMatchValidator, matchControllers.createMatch);

// Update a match by ID
router.patch(
  "/:matchId",
  validators.idValidator,
  validators.updateMatchValidator,
  matchControllers.updateMatch
);

// Delete a match by ID
router.delete(
  "/:matchId",
  validators.idValidator,
  matchControllers.deleteMatch
);

// Update match status
router.patch(
  "/:matchId/status",
  validators.idValidator,
  validators.updateStatusValidator,
  matchControllers.updateMatchStatus
);

// Update match score
router.patch(
  "/:matchId/score",
  validators.idValidator,
  validators.updateScoreValidator,
  matchControllers.updateMatchScore
);

// Add an event to a match
router.post(
  "/:matchId/events",
  validators.idValidator,
  validators.addEventValidator,
  matchControllers.addEventToMatch
);

export default router;
