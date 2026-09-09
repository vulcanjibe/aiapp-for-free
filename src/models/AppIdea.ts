import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAppIdea extends Document {
  title: string;
  paidAppName: string;
  description: string;
  category: string;
  suggestedByUserId?: mongoose.Types.ObjectId;
  suggestedByName: string;
  votesCount: number;
  votedUserIds: mongoose.Types.ObjectId[];
  status: "open" | "in_development" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const AppIdeaSchema = new Schema<IAppIdea>(
  {
    title: { type: String, required: true },
    paidAppName: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    suggestedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    suggestedByName: { type: String, default: "Anonyme" },
    votesCount: { type: Number, default: 0 },
    votedUserIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["open", "in_development", "completed"],
      default: "open",
    },
  },
  { timestamps: true }
);

export const AppIdea: Model<IAppIdea> =
  mongoose.models.AppIdea || mongoose.model<IAppIdea>("AppIdea", AppIdeaSchema);
