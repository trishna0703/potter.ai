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

export default function useGetConcerns(status: "OPEN" | "COMPLETED") {
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
    enabled: status === "OPEN",
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
    enabled: status === "COMPLETED",
  });

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
