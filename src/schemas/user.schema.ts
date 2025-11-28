// src/schemas/user.schema.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  passwordHash?: string;
  role: "client" | "admin" | "support";
  image?: { url: string; public_id: string } | null;
  createdAt: Date;
}

const UserSchema: Schema = new Schema<IUser>({
  name: { type: String },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String },
  role: { type: String, default: "client" },
  image: {
    url: String,
    public_id: String,
  },
  createdAt: { type: Date, default: Date.now },
});

// Reuse model if already compiled (prevents recompilation errors in dev)
export const User: Model<IUser> = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);
