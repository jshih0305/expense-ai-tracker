import { categoryMeta } from "@/lib/categories";
import { formatDay, formatMoney } from "@/lib/date";
import type { Expense } from "./types";

type Props = {
  date: string;
  expenses: Expense[];
  loading: boolean;
  currentUserId: string | null;
};

export default function DayExpenses({ date, expenses, loading, currentUserId }: Props) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <section className="mt-3">
      <div className="mb-3 flex items-baseline justify-between px-1">
        <h2 className="font-bold">{formatDay(date)}</h2>
        {expenses.length > 0 && (
          <p className="text-sm text-muted">
            合計 <span className="font-bold text-foreground">{formatMoney(total)}</span>
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-[72px] animate-pulse rounded-3xl bg-surface shadow-card" />
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <div className="rounded-3xl bg-surface px-4 py-12 text-center shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--hero-from)] to-[var(--hero-to)] text-2xl">
            <span aria-hidden>📝</span>
          </div>
          <p className="mt-4 font-semibold">這天還沒有記帳</p>
          <p className="mt-1 text-sm text-muted">在下方輸入「午餐 120、飲料 60」試試看</p>
        </div>
      ) : (
        <ul className="overflow-hidden rounded-3xl bg-surface shadow-card">
          {expenses.map((expense, index) => {
            const meta = categoryMeta(expense.category);
            const isMine = expense.user?.id === currentUserId;
            return (
              <li key={expense._id} className="relative flex items-center gap-3 px-4 py-3.5">
                {/* 分隔線從文字開始，不穿過圖示 */}
                {index > 0 && <span className="absolute top-0 right-4 left-[68px] h-px bg-line" aria-hidden />}
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl"
                  style={{ backgroundColor: `color-mix(in srgb, ${meta.color} 14%, white)` }}
                  aria-hidden
                >
                  {meta.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{expense.item}</p>
                  <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-muted">
                    <span
                      className={`shrink-0 rounded-full px-2 py-px text-[10px] font-semibold ${
                        isMine ? "bg-foreground text-white" : "bg-track text-foreground/80"
                      }`}
                    >
                      {isMine ? "我" : (expense.user?.name ?? "未知")}
                    </span>
                    <span className="truncate">
                      {expense.category}
                      {expense.note && ` · ${expense.note}`}
                    </span>
                  </p>
                </div>
                <p className="shrink-0 font-bold tabular-nums">
                  {expense.currency !== "TWD" && (
                    <span className="mr-1 text-xs font-normal text-muted">{expense.currency}</span>
                  )}
                  {formatMoney(expense.amount)}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
