import { EXPENSE_CATEGORIES } from "@/lib/categories";
import { daysInMonth, formatMoney } from "@/lib/date";
import CategoryBreakdown from "./CategoryBreakdown";
import StatCards from "./StatCards";
import type { Expense } from "./types";

type Props = {
  month: string;
  today: string;
  expenses: Expense[];
  loading: boolean;
};

export default function MonthStats({ month, today, expenses, loading }: Props) {
  if (loading) {
    return <div className="h-64 animate-pulse rounded-3xl bg-surface shadow-card" />;
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = EXPENSE_CATEGORIES.map((category) => {
    const items = expenses.filter((e) => e.category === category);
    return {
      category,
      amount: items.reduce((sum, e) => sum + e.amount, 0),
      count: items.length,
    };
  });

  // 本月算到今天為止的天數；過去的月份算整個月
  const currentMonth = today.slice(0, 7);
  const elapsedDays =
    month === currentMonth ? Number(today.slice(8)) : month < currentMonth ? daysInMonth(month) : 0;
  const dailyAverage = elapsedDays > 0 ? total / elapsedDays : 0;

  return (
    <div className="flex flex-col gap-3">
      <StatCards
        cards={[
          { label: "日均花費", icon: "📅", value: formatMoney(Math.round(dailyAverage)) },
          { label: "記帳筆數", icon: "🧾", value: `${expenses.length} 筆` },
        ]}
      />
      <CategoryBreakdown
        title={`${Number(month.slice(5))} 月各分類花費`}
        items={byCategory}
        emptyText="這個月還沒有任何花費"
      />
    </div>
  );
}
