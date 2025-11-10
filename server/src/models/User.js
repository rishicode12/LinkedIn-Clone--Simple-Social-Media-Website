import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String },
    coverUrl: { type: String },
    headline: { type: String },
    location: { type: String },
    connectionsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.model("User", userSchema);