import { RotateCcw } from "lucide-react";
import { Button } from "#components/ui/button";

const PlantListError = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-destructive/10">
        <RotateCcw className="size-10 text-destructive" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Failed to load plants</h2>
        <p className="max-w-sm text-sm text-gray-500">
          Something went wrong while fetching your plants. Please try again.
        </p>
      </div>

      <Button onClick={onRetry} className="cursor-pointer">
        Refresh
      </Button>
    </div>
  );
};

export default PlantListError;
