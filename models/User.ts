import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const USER_ROLES = ["user", "admin"] as const;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // bcrypt 雜湊後的密碼，預設查詢時不回傳
    password: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: USER_ROLES, default: "user" },
  },
  { timestamps: true },
);

export type User = InferSchemaType<typeof userSchema>;

const UserModel: Model<User> =
  mongoose.models.User || mongoose.model<User>("User", userSchema);

export default UserModel;
