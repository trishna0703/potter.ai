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

  const getConcerns = (query?: string) => {
    return useQuery({
      queryKey: ["all-concerns", query],
      queryFn: async (): Promise<Concern[]> => {
        const response = await apiClient(API_ENDPOINTS.CONCERNS + "?" + query, {
          method: "GET",
        });

        return response;
      },
      retry: false,
    });
  };

  const invalidateConcerns = (query?: string) => {
    client.invalidateQueries({ queryKey: ["all-concerns", query] });
  };

  return {
    getConcerns,
    invalidateConcerns,
  };
}
