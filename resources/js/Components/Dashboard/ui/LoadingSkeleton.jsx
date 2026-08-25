export function Skeleton({ className = '' }) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-700/60 ${className}`}
            aria-hidden="true"
        />
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8 p-4 md:p-8" aria-busy="true" aria-label="Loading dashboard">
            <div className="space-y-3">
                <Skeleton className="h-10 w-72 max-w-full" />
                <Skeleton className="h-5 w-96 max-w-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-36 rounded-2xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Skeleton className="h-80 rounded-2xl xl:col-span-2" />
                <Skeleton className="h-80 rounded-2xl" />
            </div>
            <Skeleton className="h-64 rounded-2xl" />
        </div>
    );
}

export function Spinner({ size = 'md', className = '' }) {
    const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
    return (
        <div
            className={`${sizes[size]} border-2 border-slate-200 dark:border-slate-700 border-t-red-500 rounded-full animate-spin ${className}`}
            role="status"
            aria-label="Loading"
        />
    );
}
