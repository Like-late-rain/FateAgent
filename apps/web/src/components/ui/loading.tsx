export function Loading({ label = '加载中...' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-muted-foreground/60" />
      <span>{label}</span>
    </div>
  );
}
