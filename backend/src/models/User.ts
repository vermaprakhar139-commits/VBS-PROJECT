import { Schema, model, Document } from "mongoose";

export type UserRole = "user" | "admin";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  isEmailVerified: boolean;
  role: UserRole;
  walletBalance: number;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, required: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    walletBalance: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);