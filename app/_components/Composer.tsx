"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import type { Expense } from "./types";

type Props = {
  onSaved: (expenses: Expense[], message: string) => void;
  onError: (message: string) => void;
};

export default function Composer({ onSaved, onError }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!text.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/expenses/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      if (!res.ok) {
        onError(data.error ?? "發生錯誤");
        return;
      }

      onSaved(data.expenses, data.message ?? `已記下 ${data.expenses.length} 筆`);
      setText("");
    } catch {
      onError("無法連線到伺服器");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // 中文輸入法選字時按 Enter 不要送出
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md bg-gradient-to-t from-background via-background/95 to-transparent px-4 pt-8 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-end gap-2 rounded-[26px] bg-surface p-2 pl-5 shadow-float ring-1 ring-line">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="說說今天花了什麼…"
          rows={1}
          disabled={loading}
          className="max-h-32 min-h-10 flex-1 resize-none bg-transparent py-2.5 text-base outline-none [field-sizing:content] placeholder:text-muted disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          aria-label="AI 分析並記帳"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-white transition-all active:scale-90 disabled:opacity-25"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          )}
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-muted">
        {loading ? "AI 分析中…" : "✨ AI 會自動拆解項目、金額與分類"}
      </p>
    </form>
  );
}
