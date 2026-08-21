import PlantsList from "./components/PlantsList";
import usePlant from "./hooks/usePlant";

const Plants = () => {
  const { allPlants } = usePlant();
  const { data: plantList, isLoading, isError } = allPlants;

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
        {isLoading ? "Growing..." : null}
        {plantList ? <PlantsList plantList={plantList} /> : null}
        {isError ? "Failed to load plants" : null}
      </section>
    </div>
  );
};

export default Plants;
