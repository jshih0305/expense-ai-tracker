import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession, unauthorized } from "@/lib/session";
import ExpenseModel from "@/models/Expense";
// populate 需要 User model 已註冊
import "@/models/User";

// GET /api/expenses?month=YYYY-MM：取得共同記帳本某個月的所有紀錄（含記帳人）
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  const month = request.nextUrl.searchParams.get("month");
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return Response.json({ error: "month 格式需為 YYYY-MM" }, { status: 400 });
  }

  try {
    await connectDB();
    const docs = await ExpenseModel.find({ date: { $regex: `^${month}-` } })
      .sort({ date: -1, createdAt: -1 })
      .populate<{ userId: { _id: string; name: string } | null }>("userId", "name")
      .lean();

    // 把 populate 後的 userId 整理成 user 欄位；舊資料沒有記帳人時為 null
    const expenses = docs.map(({ userId, ...expense }) => ({
      ...expense,
      user: userId ? { id: userId._id, name: userId.name } : null,
    }));

    return Response.json({ expenses });
  } catch (error) {
    console.error("[expenses] 讀取失敗", error);
    return Response.json({ error: "讀取紀錄失敗" }, { status: 500 });
  }
}
