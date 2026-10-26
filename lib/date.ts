// 日期一律用 "YYYY-MM-DD" / "YYYY-MM" 字串，以台北時區為準
const TIME_ZONE = "Asia/Taipei";

export function todayStr() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: TIME_ZONE });
}

export function daysInMonth(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export function monthDays(month: string) {
  return Array.from(
    { length: daysInMonth(month) },
    (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`,
  );
}

export function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1 + delta, 1)).toISOString().slice(0, 7);
}

export function weekday(date: string) {
  return "日一二三四五六"[new Date(`${date}T00:00:00Z`).getUTCDay()];
}

export function formatMonth(month: string) {
  const [y, m] = month.split("-").map(Number);
  return `${y} 年 ${m} 月`;
}

export function formatDay(date: string) {
  const [, m, d] = date.split("-").map(Number);
  return `${m} 月 ${d} 日 週${weekday(date)}`;
}

export function formatMoney(amount: number) {
  return `$${amount.toLocaleString("zh-TW", { maximumFractionDigits: 2 })}`;
}
