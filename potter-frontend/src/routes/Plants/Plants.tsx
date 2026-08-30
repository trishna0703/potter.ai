import { Button } from "#components/ui/button";
import { useState } from "react";
import PlantsList from "./components/PlantsList";
import PlantListSkeleton from "./components/PlantListSkeleton";
import PlantListError from "./components/PlantListError";
import usePlant from "./hooks/usePlant";

const Plants = () => {
  const [plantStatus, setPlantStatus] = useState<"active" | "inactive">(
    "active",
  );
  const { allPlants, invalidate } = usePlant(plantStatus);
  const { data: plantList, isLoading, isError, refetch } = allPlants;

  const handleRetry = async () => {
    await invalidate.plants();
    refetch();
  };

  return (
    <div className="p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Plants</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your plants and keep track of their care routine.
          </p>
        </div>
      </header>

      <section className="mt-6">
        {isLoading ? <PlantListSkeleton /> : null}
        {plantList ? (
          <div>
            <div className="flex gap-4">
              <Button
                variant={plantStatus === "active" ? "default" : "ghost"}
                onClick={() => setPlantStatus("active")}
              >
                Active
              </Button>
              <Button
                variant={plantStatus === "inactive" ? "default" : "ghost"}
                onClick={() => setPlantStatus("inactive")}
              >
                Inactive
              </Button>
            </div>
            <PlantsList plantList={plantList} />
          </div>
        ) : null}
        {isError ? <PlantListError onRetry={handleRetry} /> : null}
      </section>
    </div>
  );
};

export default Plants;
