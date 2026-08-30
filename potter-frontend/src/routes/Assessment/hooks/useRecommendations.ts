import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";
import type { AIRecommendationResponse } from "@/types/recommendation";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export default function useRecommendations(id: number) {
  const recommendations: UseQueryResult<AIRecommendationResponse, Error> =
    useQuery({
      queryKey: ["recommendations", id],
      queryFn: async (): Promise<AIRecommendationResponse> => {
        return await apiClient(`${API_ENDPOINTS.RECOMMENDATIONS}/${id}`, {
          method: "GET",
          credentials: "include",
        });
      },
      enabled: !!id,
      retry: false,
    });

  return recommendations;
}
