"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { formatMoney, formatMonth, shiftMonth, todayStr } from "@/lib/date";
import Composer from "./_components/Composer";
import DateStrip from "./_components/DateStrip";
import DayExpenses from "./_components/DayExpenses";
import MonthStats from "./_components/MonthStats";
import YearStats from "./_components/YearStats";
import type { Expense, YearStats as YearStatsData } from "./_components/types";

type Tab = "daily" | "stats";
type Period = "month" | "year";

const noopSubscribe = () => () => {};

export default function Home() {
  // 「今天」只在瀏覽器端計算，避免伺服器預先渲染時把日期寫死
  const today = useSyncExternalStore(noopSubscribe, todayStr, () => null);

  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("daily");
  const [period, setPeriod] = useState<Period>("month");
  const [data, setData] = useState<{ month: string; expenses: Expense[] } | null>(null);
  const [yearStats, setYearStats] = useState<YearStatsData | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);

  const date = selectedDate ?? today;
  const month = date?.slice(0, 7) ?? null;
  const year = date?.slice(0, 4) ?? null;
  const showYear = tab === "stats" && period === "year";

  // 登入過期時導回登入頁
  const fetchJson = useCallback(
    async (url: string) => {
      const res = await fetch(url);
      if (res.status === 401) {
        window.location.replace("/login");
        return null;
      }
      return res.json();
    },
    [],
  );

  useEffect(() => {
    fetchJson("/api/auth/me").then((json) => {
      if (json?.user) setUser(json.user);
    });
  }, [fetchJson]);

  useEffect(() => {
    if (!month) return;
    let cancelled = false;

    fetchJson(`/api/expenses?month=${month}`)
      .then((json) => {
        if (cancelled || !json) return;
        if (json.error) setToast({ text: json.error, error: true });
        setData({ month, expenses: json.expenses ?? [] });
      })
      .catch(() => {
        if (!cancelled) setToast({ text: "無法讀取紀錄", error: true });
      });

    return () => {
      cancelled = true;
    };
  }, [month, reloadKey, fetchJson]);

  // 年度統計只在切到「年」時才載入
  useEffect(() => {
    if (!showYear || !year) return;
    let cancelled = false;

    fetchJson(`/api/expenses/stats?year=${year}`)
      .then((json) => {
        if (cancelled || !json) return;
        if (json.error) {
          setToast({ text: json.error, error: true });
          return;
        }
        setYearStats(json);
      })
      .catch(() => {
        if (!cancelled) setToast({ text: "無法讀取統計", error: true });
      });

    return () => {
      cancelled = true;
    };
  }, [showYear, year, reloadKey, fetchJson]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const loading = data?.month !== month;
  const monthExpenses = useMemo(() => (loading ? [] : (data?.expenses ?? [])), [data, loading]);
  const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const markedDates = useMemo(() => new Set(monthExpenses.map((e) => e.date)), [monthExpenses]);
  const dayExpenses = monthExpenses.filter((e) => e.date === date);

  const yearLoading = yearStats?.year !== year;
  const yearTotal = yearLoading ? 0 : (yearStats?.months.reduce((sum, m) => sum + m.amount, 0) ?? 0);

  // 切到本月時停在今天，其他月份停在 1 號
  function goToMonth(target: string) {
    if (!today) return;
    setSelectedDate(target === today.slice(0, 7) ? today : `${target}-01`);
  }

  function navigate(delta: number) {
    if (!month) return;
    goToMonth(shiftMonth(month, showYear ? delta * 12 : delta));
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    // 整頁重新載入，清掉路由快取和上一位使用者的資料
    window.location.replace("/login");
  }

  function handleSaved(saved: Expense[], message: string) {
    setToast({ text: message });
    if (saved.length > 0) {
      setSelectedDate(saved[0].date);
      setTab("daily");
    }
    setReloadKey((k) => k + 1);
  }

  if (!today || !date || !month || !year) {
    return <div className="min-h-dvh" />;
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <header className="px-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--hero-from)] to-[var(--hero-to)] text-base font-bold shadow-card ring-2 ring-white"
              aria-hidden
            >
              {user?.name.slice(0, 1).toUpperCase() ?? ""}
            </span>
            <div className="min-w-0 leading-tight">
              <p className="text-xs text-muted">歡迎回來</p>
              <p className="truncate font-bold">{user?.name ?? "…"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="shrink-0 rounded-full bg-surface px-3.5 py-2 text-xs font-medium text-muted shadow-card active:scale-95 transition-transform"
          >
            登出
          </button>
        </div>

        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[var(--hero-from)] via-[var(--hero-via)] to-[var(--hero-to)] p-5 shadow-card ring-1 ring-white/70">
          {/* 裝飾用的柔光 */}
          <div className="pointer-events-none absolute -top-16 -right-10 h-44 w-44 rounded-full bg-white/50 blur-2xl" aria-hidden />

          <div className="relative flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label={showYear ? "上一年" : "上個月"}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-foreground/70 backdrop-blur active:scale-95 transition-transform"
            >
              <Chevron direction="left" />
            </button>
            <p className="text-sm font-semibold">{showYear ? `${year} 年` : formatMonth(month)}</p>
            <button
              type="button"
              onClick={() => navigate(1)}
              aria-label={showYear ? "下一年" : "下個月"}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-foreground/70 backdrop-blur active:scale-95 transition-transform"
            >
              <Chevron direction="right" />
            </button>
          </div>

          <div className="relative mt-5 text-center">
            <p className="text-xs font-medium text-foreground/60">
              {showYear ? "全年共同支出" : `${Number(month.slice(5))} 月共同支出`}
            </p>
            <p className="mt-1 text-[42px] leading-none font-bold tracking-tight">
              {(showYear ? yearLoading : loading) ? (
                <span className="text-foreground/30">—</span>
              ) : (
                formatMoney(showYear ? yearTotal : monthTotal)
              )}
            </p>
            {!showYear && !loading && (
              <p className="mt-2 text-xs text-foreground/60">共 {monthExpenses.length} 筆紀錄</p>
            )}
          </div>
        </section>

        <Segmented
          className="mt-5"
          value={tab}
          onChange={setTab}
          options={[
            ["daily", "每日明細"],
            ["stats", "統計"],
          ]}
        />
      </header>

      <main className="flex-1 px-4 pt-4 pb-40">
        {tab === "daily" ? (
          <>
            <DateStrip
              month={month}
              selected={date}
              today={today}
              markedDates={markedDates}
              onSelect={setSelectedDate}
            />
            <DayExpenses
              date={date}
              expenses={dayExpenses}
              loading={loading}
              currentUserId={user?.id ?? null}
            />
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <Segmented
              className="w-36 self-center text-xs"
              value={period}
              onChange={setPeriod}
              options={[
                ["month", "月"],
                ["year", "年"],
              ]}
            />
            {period === "month" ? (
              <MonthStats month={month} today={today} expenses={monthExpenses} loading={loading} />
            ) : (
              <YearStats
                year={year}
                today={today}
                stats={yearLoading ? null : yearStats}
                loading={yearLoading}
                onSelectMonth={(target) => {
                  goToMonth(target);
                  setPeriod("month");
                }}
              />
            )}
          </div>
        )}
      </main>

      {toast && (
        <div
          role="status"
          className={`fixed inset-x-0 bottom-32 z-30 mx-auto w-fit max-w-[90%] rounded-full px-4 py-2.5 text-sm font-medium shadow-float ${
            toast.error ? "bg-red-600 text-white" : "bg-foreground text-white"
          }`}
        >
          {toast.text}
        </div>
      )}

      <Composer onSaved={handleSaved} onError={(text) => setToast({ text, error: true })} />
    </div>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
  className = "",
}: {
  value: T;
  onChange: (value: T) => void;
  options: [T, string][];
  className?: string;
}) {
  return (
    <div
      className={`grid rounded-full bg-track/80 p-1 text-sm font-medium ${className}`}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      role="tablist"
    >
      {options.map(([key, label]) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={value === key}
          onClick={() => onChange(key)}
          className={`rounded-full py-2 transition-all ${
            value === key ? "bg-surface font-semibold text-foreground shadow-card" : "text-muted"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}
