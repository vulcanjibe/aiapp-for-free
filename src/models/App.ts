import mongoose, { Schema, Document, Model } from "mongoose";

export type AppStatus = "pending" | "validated" | "rejected";

export interface ISemiValidationResult {
  githubAccessible: boolean;
  hasLicense: boolean;
  hasDockerfile: boolean;
  databaseDetected?: string;
  notes: string[];
}

export interface IApp extends Document {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  replacedApp: string;
  categories: string[];
  features: string[];
  githubUrl: string;
  techStack: string[];
  appType: "Web" | "PWA";
  database: "MongoDB" | "PostgreSQL";
  demoUrl?: string;
  developerId: mongoose.Types.ObjectId;
  developerName: string;
  forkedFromAppId?: mongoose.Types.ObjectId;
  status: AppStatus;
  rejectionReason?: string;
  semiValidation?: ISemiValidationResult;
  viewsCount: number;
  clicksCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const AppSchema = new Schema<IApp>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    replacedApp: { type: String, required: true, index: true },
    categories: [{ type: String, required: true, index: true }],
    features: [{ type: String, required: true }],
    githubUrl: { type: String, required: true },
    techStack: [{ type: String, required: true }],
    appType: { type: String, enum: ["Web", "PWA"], default: "Web" },
    database: { type: String, enum: ["MongoDB", "PostgreSQL"], required: true },
    demoUrl: { type: String },
    developerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    developerName: { type: String, required: true },
    forkedFromAppId: { type: Schema.Types.ObjectId, ref: "App" },
    status: {
      type: String,
      enum: ["pending", "validated", "rejected"],
      default: "pending",
      index: true,
    },
    rejectionReason: { type: String },
    semiValidation: {
      githubAccessible: { type: Boolean, default: false },
      hasLicense: { type: Boolean, default: false },
      hasDockerfile: { type: Boolean, default: false },
      databaseDetected: { type: String },
      notes: [{ type: String }],
    },
    viewsCount: { type: Number, default: 0 },
    clicksCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const App: Model<IApp> =
  mongoose.models.App || mongoose.model<IApp>("App", AppSchema);
