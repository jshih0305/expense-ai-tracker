import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession, unauthorized } from "@/lib/session";
import ExpenseModel from "@/models/Expense";

type Group = { _id: string; amount: number; count: number };

// GET /api/expenses/stats?year=YYYY：共同記帳本整年的每月合計與分類合計
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  const year = request.nextUrl.searchParams.get("year");
  if (!year || !/^\d{4}$/.test(year)) {
    return Response.json({ error: "year 格式需為 YYYY" }, { status: 400 });
  }

  try {
    await connectDB();
    const [result] = await ExpenseModel.aggregate<{ byMonth: Group[]; byCategory: Group[] }>([
      { $match: { date: { $regex: `^${year}-` } } },
      {
        $facet: {
          byMonth: [
            {
              $group: {
                _id: { $substrBytes: ["$date", 0, 7] },
                amount: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
          ],
          byCategory: [
            { $group: { _id: "$category", amount: { $sum: "$amount" }, count: { $sum: 1 } } },
          ],
        },
      },
    ]);

    // 補齊 12 個月，沒有紀錄的月份為 0
    const months = Array.from({ length: 12 }, (_, i) => {
      const month = `${year}-${String(i + 1).padStart(2, "0")}`;
      const found = result.byMonth.find((m) => m._id === month);
      return { month, amount: found?.amount ?? 0, count: found?.count ?? 0 };
    });

    const categories = result.byCategory.map((c) => ({
      category: c._id,
      amount: c.amount,
      count: c.count,
    }));

    return Response.json({ year, months, categories });
  } catch (error) {
    console.error("[expenses/stats] 讀取失敗", error);
    return Response.json({ error: "讀取統計失敗" }, { status: 500 });
  }
}
