import { useState } from "react";
import PlantsList from "./components/PlantsList";
import PlantListSkeleton from "./components/PlantListSkeleton";
import PlantListError from "./components/PlantListError";
import usePlant from "./hooks/usePlant";
import PlantsPageHero from "./components/PlantsPageHero";
import useGetConcerns from "../HealthConcerns/hooks/useGetConcerns";
import Navigator from "./components/Navigator";

export type SortBy = "name" | "species" | "added_on" | "height_cm" | "pot_size";

export type SortOrder = "asc" | "desc";

export type Filters = {
  query: string;
  status: "ACTIVE" | "INACTIVE";
  location_type: "INDOOR" | "OUTDOOR" | "ALL";
  sort_by: SortBy;
  sort_order: SortOrder;
};
const Plants = () => {
  const [filters, setFilters] = useState<Filters>({
    query: "",
    status: "ACTIVE",
    location_type: "ALL",
    sort_by: "added_on" as SortBy,
    sort_order: "asc" as SortOrder,
  });

  const query = Object.entries(filters)
    .filter(([key, value]) => {
      if (key === "query" && !value) return false;
      if (key === "location_type" && value === "ALL") return false;

      return true;
    })
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  const { allPlants, invalidate } = usePlant();
  const { getConcerns } = useGetConcerns();
  const { data: plantList, isLoading, isError, refetch } = allPlants(query);
  const { data: allPlantsList } = allPlants("");
  const { data: concerns } = getConcerns();

  const handleRetry = async () => {
    await invalidate.plants();
    refetch();
  };

  const unhealthyPlantIds = concerns?.map((p) => p.plant_id).map(Number);

  return (
    <div className="flex flex-col gap-5">
      <PlantsPageHero
        totalPlants={allPlantsList?.length}
        needAttention={concerns?.length}
      />

      {allPlantsList?.length ? (
        <Navigator {...{ filters, setFilters }} />
      ) : null}

      {isLoading ? <PlantListSkeleton /> : null}

      {plantList ? (
        <PlantsList plantList={plantList} unhealthyPlants={unhealthyPlantIds} />
      ) : null}

      {isError ? <PlantListError onRetry={handleRetry} /> : null}
    </div>
  );
};

export default Plants;
