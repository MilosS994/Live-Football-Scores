export type MatchStatus = "scheduled" | "live" | "finished" | "postponed";

export type EventType =
  | "goal"
  | "yellow_card"
  | "red_card"
  | "substitution"
  | "penalty"
  | "own_goal";

export interface IEvent {
  _id: string;
  type: EventType;
  minute: number;
  player: string;
  team: "home" | "away";
  description?: string;
}

export interface IMatch {
  _id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  league: string;
  events: IEvent[];
  venue?: string;
  referee?: string;
  startTime: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  count?: number;
  matches?: IMatch[];
  liveMatches?: IMatch[];
  scheduledMatches?: IMatch[];
  finishedMatches?: IMatch[];
}
