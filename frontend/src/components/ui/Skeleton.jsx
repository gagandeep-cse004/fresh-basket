export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-line/70 ${className}`} />
);

export const ProductGridSkeleton = ({ count = 10 }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card p-3">
        <Skeleton className="aspect-square w-full" />
        <Skeleton className="mt-3 h-3 w-1/3" />
        <Skeleton className="mt-2 h-4 w-3/4" />
        <Skeleton className="mt-4 h-8 w-full" />
      </div>
    ))}
  </div>
);
