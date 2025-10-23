import Match from "../models/Match.js";
import Event, { IEvent } from "../models/Event.js";
import { Request, Response, NextFunction } from "express";
import * as socketEmitters from "../socket/socket.js";

// Get all matches
export const getAllMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, league, limit = "20" } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (league) filter.league = league;

    const matches = await Match.find(filter)
      .populate("events")
      .sort({ startTime: -1 })
      .limit(Number(limit))
      .select(
        "homeTeam awayTeam league startTime status homeScore awayScore events"
      )
      .lean();

    res.status(200).json({
      success: true,
      message: "Matches retrieved successfully",
      count: matches.length,
      matches,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single match by ID
export const getMatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findById(matchId).populate("events").lean();

    if (!match) {
      const error = new Error("Match not found");
      (error as any).status = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Match retrieved successfully",
      match,
    });
  } catch (error) {
    next(error);
  }
};

// Get live matches
export const getLiveMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const liveMatches = await Match.find({ status: "live" })
      .populate("events")
      .sort({ startTime: -1 })
      .select(
        "homeTeam awayTeam league startTime status homeScore awayScore events"
      )
      .lean();

    res.status(200).json({
      success: true,
      message: "Live matches retrieved successfully",
      count: liveMatches.length,
      liveMatches,
    });
  } catch (error) {
    next(error);
  }
};

// Get scheduled matches
export const getScheduledMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scheduledMatches = await Match.find({ status: "scheduled" })
      .populate("events")
      .sort({ startTime: 1 })
      .select(
        "homeTeam awayTeam league startTime status homeScore awayScore events"
      )
      .lean();

    res.status(200).json({
      success: true,
      message: "Scheduled matches retrieved successfully",
      count: scheduledMatches.length,
      scheduledMatches,
    });
  } catch (error) {
    next(error);
  }
};

// Get finished matches
export const getFinishedMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const finishedMatches = await Match.find({ status: "finished" })
      .populate("events")
      .sort({ startTime: -1 })
      .select(
        "homeTeam awayTeam league startTime status homeScore awayScore events"
      )
      .lean();

    res.status(200).json({
      success: true,
      message: "Finished matches retrieved successfully",
      count: finishedMatches.length,
      finishedMatches,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new match
export const createMatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const matchData = req.body;

    const newMatch = await Match.create(matchData);

    // WebSocket emit - match-created event
    socketEmitters.emitMatchCreated(newMatch);

    res.status(201).json({
      success: true,
      message: "Match created successfully",
      newMatch,
    });
  } catch (error) {
    next(error);
  }
};

// Update an existing match
export const updateMatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { matchId } = req.params;
    const updateData = req.body;

    const updatedMatch = await Match.findByIdAndUpdate(matchId, updateData, {
      new: true,
      runValidators: true,
    }).populate("events");

    if (!updatedMatch) {
      const error = new Error("Match not found");
      (error as any).status = 404;
      return next(error);
    }

    // WebSocket emit - match-update event
    socketEmitters.emitMatchUpdate(matchId!, updatedMatch);

    res.status(200).json({
      success: true,
      message: "Match updated successfully",
      updatedMatch,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a match
export const deleteMatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { matchId } = req.params;

    const match = await Match.findById(matchId);

    if (!match) {
      const error = new Error("Match not found");
      (error as any).status = 404;
      return next(error);
    }

    // Delete associated events
    await Event.deleteMany({ _id: { $in: match.events } });

    // Delete the match
    await Match.findByIdAndDelete(matchId);

    // WebSocket emit - match-deleted event
    socketEmitters.emitMatchDeleted(matchId!);

    res.status(200).json({
      success: true,
      message: "Match deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update match score
export const updateMatchScore = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { matchId } = req.params;
    const { homeScore, awayScore } = req.body;

    const updatedMatch = await Match.findByIdAndUpdate(
      matchId,
      { homeScore, awayScore },
      { new: true, runValidators: true }
    ).populate("events");

    if (!updatedMatch) {
      const error = new Error("Match not found");
      (error as any).status = 404;
      return next(error);
    }

    //  Socket emit - score-update event
    socketEmitters.emitScoreUpdate(matchId!, updatedMatch);

    res.status(200).json({
      success: true,
      message: "Match score updated successfully",
      updatedMatch,
    });
  } catch (error) {
    next(error);
  }
};

// Update match status
export const updateMatchStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { matchId } = req.params;
    const { status } = req.body;

    const updatedMatch = await Match.findByIdAndUpdate(
      matchId,
      { status },
      { new: true, runValidators: true }
    ).populate("events");

    if (!updatedMatch) {
      const error = new Error("Match not found");
      (error as any).status = 404;
      return next(error);
    }

    // WebSocket emit - status-change event
    socketEmitters.emitStatusChange(matchId!, status);

    res.status(200).json({
      success: true,
      message: "Match status updated successfully",
      updatedMatch,
    });
  } catch (error) {
    next(error);
  }
};

// Add event to a match
export const addEventToMatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { matchId } = req.params;
    const eventData = req.body;

    const match = await Match.findById(matchId);

    if (!match) {
      const error = new Error("Match not found");
      (error as any).status = 404;
      return next(error);
    }

    // Create an event first
    const newEvent = (await Event.create(eventData)) as IEvent;
    // Then add the event to the match's events array
    match.events.push(newEvent._id as any);
    await match.save();

    // Return the updated match with populated events
    const updatedMatch = await Match.findById(matchId).populate("events");

    // WebSocket emit - match-event event
    socketEmitters.emitMatchEvent(matchId!, newEvent);

    res.status(200).json({
      success: true,
      message: "Event added to match successfully",
      event: newEvent,
      updatedMatch,
    });
  } catch (error) {
    next(error);
  }
};
