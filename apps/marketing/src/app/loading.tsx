export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-pulse rounded-full bg-foreground/20" />
        <p className="mt-4 text-sm text-muted">Loading ChaseHorse...</p>
      </div>
    </div>
  );
}
