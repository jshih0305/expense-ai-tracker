import { todayStr } from "@/lib/date";
import { connectDB } from "@/lib/mongodb";
import { analyzeExpenseText } from "@/lib/openai";
import { getSession, unauthorized } from "@/lib/session";
import ExpenseModel from "@/models/Expense";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();

  let text: unknown;
  try {
    ({ text } = await request.json());
  } catch {
    return Response.json({ error: "請求格式錯誤" }, { status: 400 });
  }

  if (typeof text !== "string" || !text.trim()) {
    return Response.json({ error: "請輸入要分析的文字" }, { status: 400 });
  }
  const rawText = text.trim();

  try {
    const analyzed = await analyzeExpenseText(rawText);

    if (analyzed.length === 0) {
      return Response.json({ expenses: [], message: "沒有找到任何消費紀錄" });
    }

    await connectDB();
    const saved = await ExpenseModel.insertMany(
      // AI 判斷不出日期時，記在今天
      analyzed.map((expense) => ({
        ...expense,
        date: expense.date ?? todayStr(),
        rawText,
        userId: session.userId,
      })),
    );

    return Response.json({ expenses: saved });
  } catch (error) {
    console.error("[analyze] 失敗", error);
    const message = error instanceof Error ? error.message : "未知錯誤";
    return Response.json({ error: `分析失敗：${message}` }, { status: 500 });
  }
}
