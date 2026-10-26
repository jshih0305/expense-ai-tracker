export type Expense = {
  _id: string;
  item: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  note: string;
  rawText: string;
  createdAt: string;
  // 記帳人；舊資料沒有記帳人時為 null
  user: { id: string; name: string } | null;
};

export type CategoryTotal = {
  category: string;
  amount: number;
  count: number;
};

export type YearStats = {
  year: string;
  months: { month: string; amount: number; count: number }[];
  categories: CategoryTotal[];
};
