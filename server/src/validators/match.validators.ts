import { body, query, param } from "express-validator";
import validate from "../middlewares/validate.js";

// Create match validator
export const createMatchValidator = [
  body("homeTeam")
    .trim()
    .notEmpty()
    .withMessage("Home team is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Home team name must be between 2 and 50 characters long"),

  body("awayTeam")
    .trim()
    .notEmpty()
    .withMessage("Away team is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Away team name must be between 2 and 50 characters long"),

  body("league")
    .trim()
    .notEmpty()
    .withMessage("League is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("League name must be between 2 and 100 characters long"),

  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .isISO8601()
    .withMessage("Start time must be a valid date"),

  body("venue")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Venue must be max 100 characters long"),

  body("referee")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Referee must be max 100 characters long"),

  validate,
];

// Update match validator
export const updateMatchValidator = [
  body("homeTeam")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Home team name must be between 2 and 50 characters long"),

  body("awayTeam")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Away team name must be between 2 and 50 characters long"),

  body("league")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("League name must be between 2 and 100 characters long"),

  body("startTime")
    .optional()
    .isISO8601()
    .withMessage("Start time must be a valid date"),

  body("venue")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Venue must be max 100 characters long"),

  body("referee")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Referee must be max 100 characters long"),

  validate,
];

// Update score validator
export const updateScoreValidator = [
  body("homeScore")
    .notEmpty()
    .withMessage("Home score is required")
    .isInt({ min: 0 })
    .withMessage("Home score must be a non-negative integer"),

  body("awayScore")
    .notEmpty()
    .withMessage("Away score is required")
    .isInt({ min: 0 })
    .withMessage("Away score must be a non-negative integer"),

  validate,
];

// Update status validator
export const updateStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["scheduled", "live", "finished", "postponed"])
    .withMessage("Status must be one of: scheduled, live, finished, postponed"),

  validate,
];

// Add event validator
export const addEventValidator = [
  body("type")
    .notEmpty()
    .withMessage("Event type is required")
    .isIn([
      "goal",
      "yellow_card",
      "red_card",
      "substitution",
      "penalty",
      "own_goal",
    ])
    .withMessage("Invalid event type"),

  body("minute")
    .notEmpty()
    .withMessage("Minute is required")
    .isInt({ min: 0, max: 120 })
    .withMessage("Minute must be between 0 and 120"),

  body("player")
    .trim()
    .notEmpty()
    .withMessage("Player name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Player name must be between 2 and 100 characters long"),

  body("team")
    .notEmpty()
    .withMessage("Team is required")
    .isIn(["home", "away"])
    .withMessage("Team must be either 'home' or 'away'"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description must be max 200 characters long"),

  validate,
];

// Query matches validator
export const queryValidator = [
  query("status")
    .optional()
    .isIn(["scheduled", "live", "finished", "postponed"])
    .withMessage("Invalid status value"),

  query("league")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("League must be between 2 and 100 characters long"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  validate,
];

// Match ID validator
export const idValidator = [
  param("matchId").isMongoId().withMessage("Invalid match ID"),
  validate,
];
