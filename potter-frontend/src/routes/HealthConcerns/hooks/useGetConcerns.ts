import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";

import { useQuery, useQueryClient } from "@tanstack/react-query";

type Concern = {
  id: number;
  status: string;
  plant_id: number | null;
  initial_context: number;
  reported_on: string;
  identified_species: string;
  occurred_on: string;
  photo_url: string;
  photo_id: number;
  assessment_id: number;
};

export default function useGetConcerns() {
  const client = useQueryClient();

  const allActiveConcerns = useQuery({
    queryKey: ["all-active-concerns"],
    queryFn: async (): Promise<Concern[]> => {
      const response = await apiClient(API_ENDPOINTS.CONCERNS, {
        method: "GET",
      });

      return response;
    },
    retry: false,
  });

  const allClosedConcerns = useQuery({
    queryKey: ["all-closed-concerns"],
    queryFn: async (): Promise<Concern[]> => {
      const response = await apiClient(API_ENDPOINTS.CONCERNS_INACTIVE, {
        method: "GET",
      });

      return response;
    },
    retry: false,
  });
  //   const getPlantDetail = (plantId: number) => {
  //     return useQuery({
  //       queryKey: ["plant", plantId],
  //       queryFn: async (): Promise<Plant> => {
  //         const response = await apiClient(`${API_ENDPOINTS.PLANT(plantId)}`, {
  //           method: "GET",
  //         });

  //         return response.json();
  //       },
  //       enabled: !!plantId,
  //     });
  //   };

  const invalidateConcerns = () => {
    client.invalidateQueries({ queryKey: ["all-active-concerns"] });
  };

  //   const invalidatePlantDetail = (plantId: number) => {
  //     client.invalidateQueries({ queryKey: ["plant", plantId] });
  //   };

  return {
    allActiveConcerns,
    allClosedConcerns,
    invalidate: {
      concerns: invalidateConcerns,
    },
  };
}
