// 前後端共用的分類設定（不能 import mongoose，前端也會用到）
export const EXPENSE_CATEGORIES = [
  "餐飲",
  "交通",
  "購物",
  "娛樂",
  "居住",
  "醫療",
  "教育",
  "其他",
] as const;

export type Category = (typeof EXPENSE_CATEGORIES)[number];

// 顏色固定跟著分類走（不隨排名改變），色值定義在 globals.css
export const CATEGORY_META: Record<Category, { icon: string; color: string }> = {
  餐飲: { icon: "🍜", color: "var(--cat-1)" },
  交通: { icon: "🚇", color: "var(--cat-2)" },
  購物: { icon: "🛍️", color: "var(--cat-3)" },
  娛樂: { icon: "🎮", color: "var(--cat-4)" },
  居住: { icon: "🏠", color: "var(--cat-5)" },
  醫療: { icon: "💊", color: "var(--cat-6)" },
  教育: { icon: "📚", color: "var(--cat-7)" },
  其他: { icon: "📦", color: "var(--cat-other)" },
};

export function categoryMeta(category: string) {
  return CATEGORY_META[category as Category] ?? CATEGORY_META["其他"];
}
