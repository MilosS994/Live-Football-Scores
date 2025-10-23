import axios from "axios";
import Match from "../models/Match.js";
import "dotenv/config";

import { getIO } from "../socket/socket.js";

const API_KEY = process.env.FOOTBALL_API_KEY;
const API_URL = "https://api.football-data.org/v4";

// Create axios instance
const footballApi = axios.create({
  baseURL: API_URL,
  headers: {
    "X-Auth-Token": API_KEY,
  },
  timeout: 10000, // 10 seconds max
});

// Add keys to league codes from football api so it is more human readable
export const LEAGUES = {
  PREMIER_LEAGUE: 2021,
  LA_LIGA: 2014,
  BUNDESLIGA: 2002,
  SERIE_A: 2019,
  LIGUE_1: 2015,
};

// MAP API status on model
const mapStatus = (
  apiStatus: string
): "scheduled" | "live" | "finished" | "postponed" => {
  const statusMap: Record<
    string,
    "scheduled" | "live" | "finished" | "postponed"
  > = {
    SCHEDULED: "scheduled",
    TIMED: "scheduled",
    IN_PLAY: "live",
    PAUSED: "live",
    FINISHED: "finished",
    AWARDED: "finished",
    POSTPONED: "postponed",
    CANCELLED: "finished",
    SUSPENDED: "postponed",
  };
  return statusMap[apiStatus] || "scheduled";
};

// Sync single league
export const syncLeagueMatches = async (
  leagueId: number,
  dateFrom?: string,
  dateTo?: string
) => {
  try {
    console.log(`Syncing league ${leagueId}...`);

    const params: any = {};
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;

    const response = await footballApi.get(
      `/competitions/${leagueId}/matches`,
      {
        params,
      }
    );

    const apiMatches = response.data.matches || [];

    if (apiMatches.length === 0) {
      console.log("No matches found");
      return 0;
    }

    let syncedCount = 0;

    for (const apiMatch of apiMatches) {
      const matchData = {
        apiId: apiMatch.id,
        homeTeam: apiMatch.homeTeam.name,
        awayTeam: apiMatch.awayTeam.name,
        homeScore: apiMatch.score.fullTime.home || 0,
        awayScore: apiMatch.score.fullTime.away || 0,
        league: apiMatch.competition.name,
        status: mapStatus(apiMatch.status),
        startTime: new Date(apiMatch.utcDate),
        venue: apiMatch.venue || "Unknown",
      };

      const existingMatch = await Match.findOne({ apiId: apiMatch.id });

      if (existingMatch) {
        const scoreChanged =
          existingMatch.homeScore !== matchData.homeScore ||
          existingMatch.awayScore !== matchData.awayScore;
        const statusChanged = existingMatch.status !== matchData.status;

        await Match.findByIdAndUpdate(existingMatch._id, matchData);

        try {
          const io = getIO();

          if (scoreChanged) {
            io.to(`match-${existingMatch._id}`).emit(
              "score:updated",
              matchData
            );
            io.to("all-matches").emit("score:updated", matchData);
            console.log(
              `Score updated: ${matchData.homeTeam} ${matchData.homeScore}-${matchData.awayScore} ${matchData.awayTeam}`
            );
          }

          if (statusChanged) {
            io.to(`match-${existingMatch._id}`).emit("status:changed", {
              matchId: existingMatch._id,
              status: matchData.status,
            });
            io.to("all-matches").emit("status:changed", {
              matchId: existingMatch._id,
              status: matchData.status,
            });
            console.log(
              `Status changed: ${matchData.homeTeam} vs ${matchData.awayTeam} → ${matchData.status}`
            );
          }
        } catch (error) {
          if (scoreChanged || statusChanged) {
            console.log(
              "Changes detected but WebSocket not running (sync script mode)"
            );
          }
        }
      } else {
        await Match.create(matchData);
      }

      syncedCount++;
    }

    console.log(`Synced ${syncedCount} matches`);
    return syncedCount;
  } catch (error: any) {
    console.error(`Error:`, error.response?.data || error.message);
    throw error;
  }
};

// Sync all leagues
export const syncAllLeagues = async (dateFrom?: string, dateTo?: string) => {
  try {
    console.log("Syncing all leagues...");

    let totalSynced = 0;

    for (const [name, id] of Object.entries(LEAGUES)) {
      console.log(`\n${name}...`);
      const count = await syncLeagueMatches(id, dateFrom, dateTo);
      totalSynced += count;

      await new Promise((resolve) => setTimeout(resolve, 6000));
    }

    console.log(`\nTotal: ${totalSynced} matches`);
    return totalSynced;
  } catch (error) {
    console.error("Error syncing:", error);
    throw error;
  }
};

export const getTodayDateRange = () => {
  const today = new Date();
  const dateFrom = today.toISOString().split("T")[0];

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateTo = tomorrow.toISOString().split("T")[0];

  return { dateFrom, dateTo };
};
