type Props = {
  cards: { label: string; value: string; icon: string }[];
};

export default function StatCards({ cards }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-3xl bg-surface p-4 shadow-card">
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--hero-from)] to-[var(--hero-to)] text-sm"
              aria-hidden
            >
              {card.icon}
            </span>
            <p className="text-xs font-medium text-muted">{card.label}</p>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
