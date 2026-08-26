import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export default function useRecommendations(id: number) {
  const recommendations: UseQueryResult<AIRecommendation[], Error> = useQuery({
    queryKey: ["recommendations", id],
    queryFn: async (): Promise<AIRecommendation[]> => {
      return await apiClient(`${API_ENDPOINTS.RECOMMENDATIONS}/${id}`, {
        method: "GET",
        credentials: "include",
      });
    },
    retry: false,
  });
}
