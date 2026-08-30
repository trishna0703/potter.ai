import { Skeleton } from "#components/ui/skeleton";

const PlantListSkeleton = () => {
  return (
    <div className="w-full">
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-10">
        {Array.from({ length: 8 }).map((_, index) => (
          <li key={index} className="w-full">
            <div className="relative z-0 w-full">
              <div className="relative z-1 flex items-center gap-4">
                <Skeleton className="size-full h-58 rounded-2xl shadow-md" />
              </div>
              <div className="mx-auto w-3/4 -translate-y-4 rounded-b-2xl bg-card p-4 pt-6 shadow-md">
                <Skeleton className="h-5 w-24" />
                <div className="flex flex-col items-start gap-2 pt-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlantListSkeleton;
