"use client";

import { useEffect, useRef } from "react";
import { monthDays, weekday } from "@/lib/date";

type Props = {
  month: string;
  selected: string;
  today: string;
  // 有紀錄的日期，顯示小圓點
  markedDates: Set<string>;
  onSelect: (date: string) => void;
};

export default function DateStrip({ month, selected, today, markedDates, onSelect }: Props) {
  const selectedRef = useRef<HTMLButtonElement>(null);

  // 切換日期或月份時，把選取的日期捲到中間
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [selected, month]);

  return (
    <div className="no-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pt-1 pb-3">
      {monthDays(month).map((date) => {
        const isSelected = date === selected;
        const isToday = date === today;
        const isFuture = date > today;
        return (
          <button
            key={date}
            ref={isSelected ? selectedRef : undefined}
            type="button"
            onClick={() => onSelect(date)}
            aria-pressed={isSelected}
            aria-label={date}
            className={`flex w-[52px] shrink-0 snap-center flex-col items-center gap-1.5 rounded-[18px] py-3 transition-all active:scale-95 ${
              isSelected
                ? "bg-foreground text-white shadow-float"
                : "bg-surface text-foreground shadow-card"
            } ${isFuture && !isSelected ? "opacity-45" : ""}`}
          >
            <span
              className={`text-[11px] font-medium ${
                isSelected ? "text-white/70" : isToday ? "text-[var(--cat-2)]" : "text-muted"
              }`}
            >
              {isToday ? "今天" : weekday(date)}
            </span>
            <span className="text-lg font-bold leading-none tabular-nums">
              {Number(date.slice(8))}
            </span>
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                markedDates.has(date) ? (isSelected ? "bg-white" : "bg-[var(--cat-2)]") : ""
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
