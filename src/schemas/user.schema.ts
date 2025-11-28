import mongoose, { Schema, Model } from "mongoose";

export interface IUser {
  name?: string;
  email: string;
  passwordHash?: string | null;
  provider: "credentials" | "google";
  role: "client" | "admin" | "support";
  image?: { url: string; public_id?: string | null } | null;

  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, default: null },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    role: {
      type: String,
      enum: ["client", "admin", "support"],
      default: "client",
    },
    image: {
      url: { type: String, required: false },
      public_id: { type: String, default: null },
    },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
