import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "user" | "developer" | "company" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isApprovedDeveloper?: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false },
    role: {
      type: String,
      enum: ["user", "developer", "company", "admin"],
      default: "user",
    },
    isApprovedDeveloper: { type: Boolean, default: true },
    avatar: { type: String },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
