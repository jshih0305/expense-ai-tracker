import { categoryMeta } from "@/lib/categories";
import { formatMoney } from "@/lib/date";
import type { CategoryTotal } from "./types";

type Props = {
  title: string;
  items: CategoryTotal[];
  emptyText: string;
};

export default function CategoryBreakdown({ title, items, emptyText }: Props) {
  const sorted = items.filter((c) => c.count > 0).sort((a, b) => b.amount - a.amount);
  const total = sorted.reduce((sum, c) => sum + c.amount, 0);
  const maxAmount = sorted[0]?.amount ?? 0;

  return (
    <div className="rounded-3xl bg-surface p-5 shadow-card">
      <h2 className="mb-5 font-bold">{title}</h2>

      {sorted.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">{emptyText}</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {sorted.map(({ category, amount, count }) => {
            const meta = categoryMeta(category);
            const percent = total > 0 ? (amount / total) * 100 : 0;
            return (
              <li key={category}>
                <div className="mb-1.5 flex items-center gap-2 text-sm">
                  <span aria-hidden>{meta.icon}</span>
                  <span className="font-medium">{category}</span>
                  <span className="text-xs text-muted">{count} 筆</span>
                  <span className="ml-auto font-semibold tabular-nums">{formatMoney(amount)}</span>
                  <span className="w-11 text-right text-xs text-muted tabular-nums">
                    {percent.toFixed(0)}%
                  </span>
                </div>
                <div
                  className="h-2.5 overflow-hidden rounded-full bg-track"
                  role="img"
                  aria-label={`${category} ${formatMoney(amount)}，佔 ${percent.toFixed(0)}%`}
                >
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{
                      width: `${maxAmount > 0 ? (amount / maxAmount) * 100 : 0}%`,
                      backgroundColor: meta.color,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
