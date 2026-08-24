import { Skeleton } from "@/components/ui/skeleton";

const AssessmentSkeleton = () => {
  return (
    <div className="flex h-full overflow-hidden flex-col">
      {/* Message history */}
      <div className="flex-1">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-8">
          {/* Assistant message */}
          <div className="flex justify-start">
            <div className="w-full max-w-[85%] space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>

          {/* User message */}
          <div className="flex justify-end">
            <div className="w-full max-w-[65%] space-y-2">
              <Skeleton className="ml-auto h-3 w-10" />
              <Skeleton className="ml-auto h-10 w-2/3 rounded-2xl" />
            </div>
          </div>

          {/* Another assistant message */}
          <div className="flex justify-start">
            <div className="w-full max-w-[85%] space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          </div>
          {/* User message */}
          <div className="flex justify-end">
            <div className="w-full max-w-[65%] space-y-2">
              <Skeleton className="ml-auto h-3 w-10" />
              <Skeleton className="ml-auto h-10 w-2/3 rounded-2xl" />
            </div>
          </div>

          {/* Another assistant message */}
          <div className="flex justify-start">
            <div className="w-full max-w-[85%] space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          </div>
          {/* User message */}
          <div className="flex justify-end">
            <div className="w-full max-w-[65%] space-y-2">
              <Skeleton className="ml-auto h-3 w-10" />
              <Skeleton className="ml-auto h-10 w-2/3 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSkeleton;
