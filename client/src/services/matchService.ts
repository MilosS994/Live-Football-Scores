import api from "./api";
import { IMatch, IApiResponse } from "../types/match";

export const matchService = {
  // Get all matches
  getAllMatches: async (params?: {
    status?: string;
    league?: string;
    limit?: number;
  }) => {
    const response = await api.get<IApiResponse<IMatch[]>>("/matches", {
      params,
    });
    return response.data;
  },

  // Get single match
  getMatch: async (matchId: string) => {
    const response = await api.get<IApiResponse<IMatch>>(`/matches/${matchId}`);
    return response.data;
  },

  // Get live matches
  getLiveMatches: async () => {
    const response = await api.get<IApiResponse<IMatch[]>>("/matches/live");
    return response.data;
  },

  // Get scheduled matches
  getScheduledMatches: async () => {
    const response = await api.get<IApiResponse<IMatch[]>>(
      "/matches/scheduled"
    );
    return response.data;
  },

  // Get finished matches
  getFinishedMatches: async () => {
    const response = await api.get<IApiResponse<IMatch[]>>("/matches/finished");
    return response.data;
  },
};
