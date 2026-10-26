import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { EXPENSE_CATEGORIES } from "@/lib/categories";

const expenseSchema = new Schema(
  {
    // 記帳的使用者
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    // 使用者輸入的原始文字
    rawText: { type: String, required: true },
    item: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "TWD" },
    category: { type: String, enum: EXPENSE_CATEGORIES, default: "其他" },
    // YYYY-MM-DD（台北時區）
    date: { type: String, required: true, index: true },
    note: { type: String, default: "" },
  },
  { timestamps: true },
);

export type Expense = InferSchemaType<typeof expenseSchema>;

const ExpenseModel: Model<Expense> =
  mongoose.models.Expense || mongoose.model<Expense>("Expense", expenseSchema);

export default ExpenseModel;
