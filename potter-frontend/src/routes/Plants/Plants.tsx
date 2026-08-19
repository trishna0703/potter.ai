import { useState } from "react";
import CreatePlantForm from "./components/CreatePlantForm";

const Plants = () => {
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Plants</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your plants and keep track of their details.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddPlantOpen(true)}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Add Plant
        </button>
      </div>

      <CreatePlantForm
        open={isAddPlantOpen}
        onClose={() => setIsAddPlantOpen(false)}
      />
    </div>
  );
};

export default Plants;
