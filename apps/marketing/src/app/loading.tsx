export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-tesla-gray">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-pulse rounded-full bg-tesla-blue/30" />
        <p className="text-sm text-tesla-muted">Loading...</p>
      </div>
    </div>
  );
}
