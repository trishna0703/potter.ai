import { Skeleton } from "#components/ui/skeleton";

const HealthConcernSkeleton = () => {
  return (
    <div className="w-full pt-8">
      <ul className="flex flex-col gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <li key={index} className="w-full">
            <div className="flex gap-4 border-[0.5px] rounded-xl flex-col sm:flex-row overflow-hidden">
              {/* Image */}
              <div className="w-full sm:w-2/5 lg:w-1/4 max-h-48 sm:max-h-64 lg:max-h-48 overflow-hidden">
                <Skeleton className="size-full min-h-40 rounded-none" />
              </div>

              {/* Content */}
              <div className="flex gap-4 lg:flex-row flex-col p-6 w-full sm:w-3/5 lg:w-3/4">
                <div className="flex flex-col h-full lg:w-2/3 gap-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-24 mt-2" />
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2 lg:justify-center">
                  <Skeleton className="h-9 w-24 lg:w-48" />
                  <Skeleton className="h-9 w-24 lg:w-48" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HealthConcernSkeleton;
