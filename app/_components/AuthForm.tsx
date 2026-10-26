"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { APP_NAME } from "@/lib/brand";

type Props = {
  mode: "login" | "register";
};

const FEATURES = [
  { icon: "🤖", title: "AI 自動記帳", text: "用說的就好，項目、金額、分類、日期自動整理" },
  { icon: "👥", title: "多人共同記帳", text: "大家記在同一本帳，每筆都看得到是誰記的" },
  { icon: "📊", title: "月度與年度統計", text: "各分類花費一目了然，隨時掌握錢花去哪" },
];

const DEMO_ROWS = [
  { icon: "🍜", item: "拉麵", category: "餐飲", amount: "$280", color: "var(--cat-1)" },
  { icon: "🚇", item: "計程車", category: "交通", amount: "$150", color: "var(--cat-2)" },
];

export default function AuthForm({ mode }: Props) {
  const isRegister = mode === "register";

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* 背景柔光 */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-[var(--hero-from)] opacity-80 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-[var(--hero-to)] opacity-80 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-[var(--hero-via)] blur-3xl" aria-hidden />

      <nav className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-2 lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--hero-from)] via-[var(--hero-via)] to-[var(--hero-to)] text-lg shadow-card ring-2 ring-white">
            <span aria-hidden>💰</span>
          </span>
          <span className="font-bold tracking-tight">{APP_NAME}</span>
        </div>
        <Link
          href={isRegister ? "/login" : "/register"}
          className="rounded-full bg-surface px-4 py-2 text-sm font-semibold shadow-card transition-transform active:scale-95"
        >
          {isRegister ? "登入" : "免費註冊"}
        </Link>
      </nav>

      <main className="relative mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 content-center gap-x-16 gap-y-10 px-5 py-10 lg:grid-cols-[1.15fr_1fr] lg:px-8 lg:py-16">
        {/* 主標語 */}
        <section className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-surface/80 px-3 py-1.5 text-xs font-semibold text-foreground/70 shadow-card backdrop-blur">
            <span aria-hidden>✨</span> AI 驅動的共同記帳本
          </p>
          <h1 className="mt-5 text-[40px] leading-[1.15] font-bold tracking-tight sm:text-5xl lg:text-[56px]">
            一句話，
            <br />
            <span className="bg-gradient-to-r from-[var(--cat-2)] via-[var(--cat-5)] to-[var(--cat-7)] bg-clip-text text-transparent">
              就把帳記好
            </span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            輸入「午餐拉麵 280，晚上計程車 150」，AI 會自動拆成一筆筆帳目，和家人朋友一起管理同一本帳。
          </p>
        </section>

        {/* 登入 / 註冊表單 */}
        <section className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <AuthCard mode={mode} />
        </section>

        {/* 示範與功能介紹 */}
        <section className="flex flex-col gap-6 lg:col-start-1 lg:row-start-2 lg:self-start">
          <div className="max-w-md rounded-[28px] bg-surface/90 p-4 shadow-card ring-1 ring-white backdrop-blur">
            <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-foreground px-4 py-2.5 text-sm text-white">
              午餐拉麵 280，晚上計程車 150
            </div>
            <p className="my-3 flex items-center gap-2 text-xs font-medium text-muted">
              <span className="h-px flex-1 bg-line" />
              <span aria-hidden>✨</span> AI 自動整理
              <span className="h-px flex-1 bg-line" />
            </p>
            <ul className="flex flex-col gap-2">
              {DEMO_ROWS.map((row) => (
                <li key={row.item} className="flex items-center gap-3 rounded-2xl bg-background px-3 py-2.5">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
                    style={{ backgroundColor: `color-mix(in srgb, ${row.color} 14%, white)` }}
                    aria-hidden
                  >
                    {row.icon}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{row.item}</p>
                    <p className="text-xs text-muted">{row.category}</p>
                  </div>
                  <p className="text-sm font-bold">{row.amount}</p>
                </li>
              ))}
            </ul>
          </div>

          <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex gap-3 sm:flex-col lg:flex-row xl:flex-col">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-surface text-xl shadow-card"
                  aria-hidden
                >
                  {feature.icon}
                </span>
                <div>
                  <p className="font-semibold">{feature.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">{feature.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="relative pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-xs text-muted">
        © {APP_NAME}
      </footer>
    </div>
  );
}

function AuthCard({ mode }: Props) {
  const isRegister = mode === "register";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "發生錯誤");
        setLoading(false);
        return;
      }

      // 整頁重新載入，避免路由快取留著登出前「/ 導回 /login」的結果而卡住
      window.location.replace("/");
    } catch {
      setError("無法連線到伺服器");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-2xl bg-background px-4 py-3.5 text-base outline-none ring-1 ring-line transition focus:bg-surface focus:ring-2 focus:ring-foreground placeholder:text-muted";

  return (
    <div className="mx-auto w-full max-w-md rounded-[32px] bg-surface p-6 shadow-float ring-1 ring-white sm:p-8">
      <h2 className="text-2xl font-bold tracking-tight">{isRegister ? "建立帳號" : "歡迎回來"}</h2>
      <p className="mt-1.5 text-sm text-muted">
        {isRegister ? "輸入驗證碼，加入共同記帳本" : "登入繼續記帳"}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        {isRegister && (
          <input
            name="name"
            type="text"
            placeholder="名稱"
            autoComplete="name"
            required
            className={inputClass}
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          inputMode="email"
          required
          className={inputClass}
        />
        <input
          name="password"
          type="password"
          placeholder={isRegister ? "密碼（至少 8 個字元）" : "密碼"}
          autoComplete={isRegister ? "new-password" : "current-password"}
          minLength={isRegister ? 8 : undefined}
          required
          className={inputClass}
        />
        {isRegister && (
          <input
            name="code"
            type="text"
            placeholder="驗證碼"
            autoComplete="off"
            autoCapitalize="off"
            required
            className={inputClass}
          />
        )}

        {error && (
          <p role="alert" className="px-1 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-2xl bg-foreground py-3.5 font-semibold text-white shadow-float transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "請稍候…" : isRegister ? "註冊並開始記帳" : "登入"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {isRegister ? "已經有帳號了？" : "還沒有帳號？"}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="ml-1 font-semibold text-foreground underline-offset-4 hover:underline"
        >
          {isRegister ? "登入" : "立即註冊"}
        </Link>
      </p>
    </div>
  );
}
