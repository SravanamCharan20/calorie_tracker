const SkeletonBlock = ({ className = "" }) => (
  <div className={`animate-pulse rounded-2xl bg-card-elevated ${className}`} />
);

const LoadingDashboard = () => (
  <div className="flex h-screen overflow-hidden bg-surface">
    <div className="hidden w-[272px] shrink-0 border-r border-border bg-card lg:block">
      <div className="p-5">
        <SkeletonBlock className="h-9 w-9 rounded-full" />
        <SkeletonBlock className="mt-4 h-10 w-full rounded-2xl" />
      </div>
      <div className="space-y-2 px-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-10 w-full rounded-full" />
        ))}
      </div>
    </div>

    <main className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-[1200px] space-y-6">
        <div className="space-y-3">
          <SkeletonBlock className="h-3 w-40" />
          <SkeletonBlock className="h-8 w-36" />
        </div>

        <SkeletonBlock className="h-5 w-64" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SkeletonBlock className="h-44 md:col-span-2" />
          <SkeletonBlock className="h-44" />
          <SkeletonBlock className="h-44" />
          <SkeletonBlock className="h-44" />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
          <SkeletonBlock className="h-72 xl:col-span-3" />
          <SkeletonBlock className="h-72 xl:col-span-2" />
        </div>

        <SkeletonBlock className="h-56" />
      </div>
    </main>
  </div>
);

export default LoadingDashboard;
