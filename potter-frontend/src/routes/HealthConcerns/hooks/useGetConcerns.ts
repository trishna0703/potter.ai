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

  const allActiveConcerns = () => {
    return useQuery({
      queryKey: ["all-active-concerns"],
      queryFn: async (): Promise<Concern[]> => {
        const response = await apiClient(API_ENDPOINTS.CONCERNS, {
          method: "GET",
        });

        return response;
      },
      retry: false,
    });
  };

  const allClosedConcerns = () => {
    return useQuery({
      queryKey: ["all-closed-concerns"],
      queryFn: async (): Promise<Concern[]> => {
        const response = await apiClient(API_ENDPOINTS.CONCERNS_INACTIVE, {
          method: "GET",
        });

        return response;
      },
      retry: false,
    });
  };

  const invalidateActiveConcerns = () => {
    client.invalidateQueries({ queryKey: ["all-active-concerns"] });
  };

  const invalidateInactiveConcerns = () => {
    client.invalidateQueries({ queryKey: ["all-closed-concerns"] });
  };

  return {
    allActiveConcerns,
    allClosedConcerns,
    invalidate: {
      active: invalidateActiveConcerns,
      inactive: invalidateInactiveConcerns,
    },
  };
}
