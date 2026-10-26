import OpenAI from "openai";
import { EXPENSE_CATEGORIES } from "@/lib/categories";
import { todayStr } from "@/lib/date";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";

export type AnalyzedExpense = {
  item: string;
  amount: number;
  currency: string;
  category: (typeof EXPENSE_CATEGORIES)[number];
  date: string | null;
  note: string;
};

// Structured Outputs：強制模型回傳符合此 JSON Schema 的結果
const expenseJsonSchema = {
  type: "object",
  properties: {
    expenses: {
      type: "array",
      items: {
        type: "object",
        properties: {
          item: { type: "string", description: "消費項目名稱" },
          amount: { type: "number", description: "金額，只填數字" },
          currency: { type: "string", description: "ISO 4217 幣別代碼，未提及時為 TWD" },
          category: { type: "string", enum: [...EXPENSE_CATEGORIES] },
          date: {
            type: ["string", "null"],
            description: "YYYY-MM-DD，無法判斷時為 null",
          },
          note: { type: "string", description: "補充說明，沒有則為空字串" },
        },
        required: ["item", "amount", "currency", "category", "date", "note"],
        additionalProperties: false,
      },
    },
  },
  required: ["expenses"],
  additionalProperties: false,
};

export async function analyzeExpenseText(text: string): Promise<AnalyzedExpense[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("請在 .env.local 設定 OPENAI_API_KEY");
  }

  const today = todayStr();

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: [
          "你是記帳助理，負責從使用者的文字中擷取所有消費紀錄。",
          `今天是 ${today}，請把「今天」「昨天」等相對日期換算成 YYYY-MM-DD。`,
          "一段文字可能包含多筆消費，請逐筆列出；若沒有任何消費，回傳空陣列。",
        ].join("\n"),
      },
      { role: "user", content: text },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "expenses", strict: true, schema: expenseJsonSchema },
    },
  });

  const message = completion.choices[0]?.message;
  if (message?.refusal) {
    throw new Error(`AI 拒絕分析：${message.refusal}`);
  }
  if (!message?.content) {
    throw new Error("AI 沒有回傳內容");
  }

  const parsed = JSON.parse(message.content) as { expenses: AnalyzedExpense[] };
  return parsed.expenses;
}
