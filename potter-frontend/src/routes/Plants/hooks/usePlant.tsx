import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";
import type { Plant } from "@/types/plantTypes";

import {
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";

export default function usePlant(status: "active" | "inactive" = "active") {
  const client = useQueryClient();

  const allPlants: UseQueryResult<Plant[], Error> = useQuery({
    queryKey: ["all-plants", status],
    queryFn: async (): Promise<Plant[]> => {
      return await apiClient(`${API_ENDPOINTS.PLANTS}${status.toUpperCase()}`, {
        method: "GET",
        credentials: "include",
      });
    },
    retry: false,
  });

  const getPlantDetail = (plantId: number) => {
    return useQuery({
      queryKey: ["plant", plantId],
      queryFn: async (): Promise<Plant> => {
        return await apiClient(`${API_ENDPOINTS.PLANT(plantId)}`, {
          method: "GET",
        });
      },
      enabled: !!plantId,
    });
  };

  const invalidatePlants = () => {
    client.invalidateQueries({ queryKey: ["all-plants"] });
  };

  const invalidatePlantDetail = (plantId: number) => {
    client.invalidateQueries({ queryKey: ["plant", plantId] });
  };

  return {
    allPlants,
    getPlantDetail,
    invalidate: {
      plants: invalidatePlants,
      plantDetails: invalidatePlantDetail,
    },
  };
}
