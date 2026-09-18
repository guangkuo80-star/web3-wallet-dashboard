/**
 * Shared empty / placeholder state for panels that need a connected wallet
 * or have no data yet. Keeps the layout stable instead of collapsing.
 */
export default function EmptyState({
  title,
  body,
  dashed = true,
}: {
  title: string;
  body: string;
  dashed?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border bg-card/30 p-8 text-center ${
        dashed ? "border-dashed border-border" : "border-border"
      }`}
    >
      <div className="mb-1 text-sm font-medium text-white/80">{title}</div>
      <div className="text-xs text-white/50">{body}</div>
    </div>
  );
}
