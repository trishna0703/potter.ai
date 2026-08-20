import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";
import type { Plant } from "@/types/plantTypes";

import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function usePlant() {
  const client = useQueryClient();

  const allPlants = useQuery({
    queryKey: ["all-plants"],
    queryFn: async (): Promise<Plant[]> => {
      const response = await apiClient(API_ENDPOINTS.PLANTS, {
        method: "GET",
        credentials: "include",
      });

      return response.json();
    },
    retry: false,
  });

  const getPlantDetail = (plantId: number) => {
    return useQuery({
      queryKey: ["plant", plantId],
      queryFn: async (): Promise<Plant> => {
        const response = await apiClient(`${API_ENDPOINTS.PLANT(plantId)}`, {
          method: "GET",
        });

        return response.json();
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
