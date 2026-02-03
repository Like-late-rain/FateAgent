export function Loading({ label = '加载中...' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-ink/70">
      <span className="h-3 w-3 animate-pulse rounded-full bg-tide" />
      <span>{label}</span>
    </div>
  );
}
