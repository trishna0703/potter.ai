import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";

import { useQuery, useQueryClient } from "@tanstack/react-query";

export type ConcernStatus = "OPEN" | "MONITORING" | "COMPLETED";
export type Concern = {
  id: number;
  plant_id: number | null;
  identified_species: string;
  name: string;
  title: string;
  photo_url: string;
  photo_id: number;
  occurred_on: string;
  reported_on: string;
  status: ConcernStatus;
  initial_context: string;
  assessment_id: number;
  is_reassessing: boolean;
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
