import { HeartPulse } from "lucide-react";
import { Button } from "#components/ui/button";
import AddNewPlantButton from "#components/utils/AddNewPlantButton";

const NoConcernFound = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
          <HeartPulse className="size-10 text-primary" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-semibold">No concerns found</h2>
          <p className="max-w-sm text-sm text-gray-500">
            Your plants are looking healthy. Raise a concern if you notice
            something off with one of them.
          </p>
        </div>

        <AddNewPlantButton>
          <Button className="button-custom">Raise a concern</Button>
        </AddNewPlantButton>
      </div>
    </>
  );
};

export default NoConcernFound;
