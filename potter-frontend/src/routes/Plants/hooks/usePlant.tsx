import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";

import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface Plant {
  id: number;
  name: string | null;
  species: string;
  location_type: "INDOOR" | "OUTDOOR" | null;
  height_cm: number | null;
  pot_size: number | null;
}

export default function usePlant() {
  const client = useQueryClient();

  const getAllPlants = useQuery({
    queryKey: ["all-plants"],
    queryFn: async (): Promise<Plant[]> => {
      const response = await apiClient(API_ENDPOINTS.PLANTS, {
        method: "GET",
      });

      return response.json();
    },
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
    getAllPlants,
    getPlantDetail,
    invalidate: {
      plants: invalidatePlants,
      plantDetails: invalidatePlantDetail,
    },
  };
}
