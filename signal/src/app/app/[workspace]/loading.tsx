import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-36 rounded-panel" />)}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Skeleton className="h-80 rounded-panel xl:col-span-2" />
        <Skeleton className="h-80 rounded-panel" />
      </div>
    </div>
  );
}
