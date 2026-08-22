import { Skeleton } from "@/components/ui/skeleton";

const AssessmentSkeleton = () => {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
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
        </div>
      </div>

      {/* Current interaction */}
      <div className="shrink-0 border-t bg-background">
        <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full max-w-2xl" />
            <Skeleton className="h-6 w-4/5 max-w-xl" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </div>

          <div className="flex justify-end">
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSkeleton;
