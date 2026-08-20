import { useState } from "react";
import CreatePlantForm from "./components/CreatePlantForm";
import { Button } from "#components/ui/button";
import PlantsList from "./components/PlantsList";

const Plants = () => {
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false);

  return (
    <div className="p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Plants</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your plants and keep track of their details.
          </p>
        </div>

        <Button variant="secondary" onClick={() => setIsAddPlantOpen(true)}>
          Add Plant
        </Button>
      </header>

      <section className="mt-6">
        <PlantsList />
      </section>

      <CreatePlantForm
        open={isAddPlantOpen}
        onClose={() => setIsAddPlantOpen(false)}
      />
    </div>
  );
};

export default Plants;
