"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/date";
import CategoryBreakdown from "./CategoryBreakdown";
import StatCards from "./StatCards";
import type { YearStats as YearStatsData } from "./types";

type Props = {
  year: string;
  today: string;
  stats: YearStatsData | null;
  loading: boolean;
  onSelectMonth: (month: string) => void;
};

export default function YearStats({ year, today, stats, loading, onSelectMonth }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  if (loading || !stats) {
    return <div className="h-80 animate-pulse rounded-3xl bg-surface shadow-card" />;
  }

  const total = stats.months.reduce((sum, m) => sum + m.amount, 0);
  const count = stats.months.reduce((sum, m) => sum + m.count, 0);

  // 今年算到本月為止的月數；過去的年份算 12 個月
  const currentYear = today.slice(0, 4);
  const elapsedMonths = year === currentYear ? Number(today.slice(5, 7)) : year < currentYear ? 12 : 0;
  const monthlyAverage = elapsedMonths > 0 ? total / elapsedMonths : 0;

  const maxAmount = Math.max(...stats.months.map((m) => m.amount));
  const peak = stats.months.find((m) => m.amount === maxAmount && m.amount > 0);
  const readout = stats.months.find((m) => m.month === hovered) ?? peak;

  return (
    <div className="flex flex-col gap-3">
      <StatCards
        cards={[
          { label: "月均花費", icon: "🗓️", value: formatMoney(Math.round(monthlyAverage)) },
          { label: "記帳筆數", icon: "🧾", value: `${count} 筆` },
        ]}
      />

      <div className="rounded-3xl bg-surface p-5 shadow-card">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-bold">每月花費</h2>
          {/* 觸控 / 滑過長條時顯示該月數值，預設顯示最高的月份 */}
          <p className="text-sm text-muted" aria-live="polite">
            {readout ? (
              <>
                {Number(readout.month.slice(5))} 月{readout === peak && !hovered && "（最高）"}{" "}
                <span className="font-semibold text-foreground">{formatMoney(readout.amount)}</span>
              </>
            ) : (
              "尚無資料"
            )}
          </p>
        </div>

        <div className="flex h-36 items-end gap-1.5 border-b border-line" onMouseLeave={() => setHovered(null)}>
          {stats.months.map((m) => {
            const isFuture = m.month > today.slice(0, 7);
            const isActive = m.month === readout?.month;
            const height = maxAmount > 0 ? (m.amount / maxAmount) * 100 : 0;
            return (
              <button
                key={m.month}
                type="button"
                disabled={isFuture}
                onClick={() => onSelectMonth(m.month)}
                onMouseEnter={() => setHovered(m.month)}
                onFocus={() => setHovered(m.month)}
                onBlur={() => setHovered(null)}
                aria-label={`${Number(m.month.slice(5))} 月 ${formatMoney(m.amount)}，點擊查看該月統計`}
                className="flex h-full flex-1 items-end disabled:cursor-default"
              >
                <span
                  className="w-full rounded-t-[4px] transition-[height,opacity] duration-500"
                  style={{
                    height: m.amount > 0 ? `max(${height}%, 3px)` : "0",
                    backgroundColor: "var(--cat-1)",
                    opacity: isActive ? 1 : 0.45,
                  }}
                />
              </button>
            );
          })}
        </div>
        <div className="mt-1.5 flex gap-1.5">
          {stats.months.map((m) => (
            <span key={m.month} className="flex-1 text-center text-[10px] text-muted tabular-nums">
              {Number(m.month.slice(5))}
            </span>
          ))}
        </div>
        <p className="mt-2 text-center text-[11px] text-muted">點長條可查看該月統計</p>
      </div>

      <CategoryBreakdown
        title={`${year} 年各分類花費`}
        items={stats.categories}
        emptyText="這一年還沒有任何花費"
      />
    </div>
  );
}
