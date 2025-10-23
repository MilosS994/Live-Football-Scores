import mongoose from "mongoose";

// Types
export type MatchStatus = "scheduled" | "live" | "finished" | "postponed";

export interface IMatch extends mongoose.Document {
  apiId?: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  league: string;
  events: Event[];
  venue?: string;
  referee?: string;
}

const MatchSchema = new mongoose.Schema(
  {
    apiId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    homeTeam: {
      type: String,
      required: [true, "Home team is required"],
      trim: true,
      minlength: [2, "Home team name must be at least 2 characters long"],
      maxlength: [50, "Home team name must be at most 50 characters long"],
    },
    awayTeam: {
      type: String,
      required: [true, "Away team is required"],
      trim: true,
      minlength: [2, "Home team name must be at least 2 characters long"],
      maxlength: [50, "Home team name must be at most 50 characters long"],
    },
    homeScore: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    awayScore: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["scheduled", "live", "finished", "postponed"],
      required: true,
      default: "scheduled",
    },
    league: {
      type: String,
      required: [true, "League is required"],
      trim: true,
    },
    startTime: {
      type: Date,
      required: [true, "Match start time is required"],
    },
    events: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Event",
      default: [],
    },
    venue: {
      type: String,
      trim: true,
      default: "",
    },
    referee: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

MatchSchema.index({ status: 1, startTime: -1 });
MatchSchema.index({ league: 1 });
MatchSchema.index({ homeTeam: 1, awayTeam: 1, startTime: -1 });

MatchSchema.set("toJSON", {
  transform: (_doc: any, ret: any) => {
    delete ret.__v;
    return ret;
  },
});

const Match = mongoose.model<IMatch>("Match", MatchSchema);

export default Match;
