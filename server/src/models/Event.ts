import mongoose from "mongoose";

// Types
export type EventType =
  | "goal"
  | "yellow_card"
  | "red_card"
  | "substitution"
  | "penalty"
  | "own_goal";

export interface IEvent extends mongoose.Document {
  type: EventType;
  minute: number;
  player: string;
  team: "home" | "away";
  description?: string;
}

const EventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "goal",
      "yellow_card",
      "red_card",
      "substitution",
      "penalty",
      "own_goal",
    ],
    required: true,
  },
  minute: {
    type: Number,
    required: true,
    min: 0,
  },
  player: {
    type: String,
    required: true,
    trim: true,
  },
  team: {
    type: String,
    enum: ["home", "away"],
    required: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
});

EventSchema.set("toJSON", {
  transform: (_doc: any, ret: any) => {
    delete ret.__v;
    return ret;
  },
});

const Event = mongoose.model<IEvent>("Event", EventSchema);

export default Event;
