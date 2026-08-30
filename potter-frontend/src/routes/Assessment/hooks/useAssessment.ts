import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

type AssessmentHistory = {
  id: number;
  concern_id: number;
  current_interaction_id: number | null;
  problem: string;
  problem_cause: string;
  confidence: string;
  explanation: string;
  created_on: string;
};

export default function useAssessment(id: number) {
  const assessment: UseQueryResult<AssessmentHistory, Error> = useQuery({
    queryKey: ["assessment", id],
    queryFn: async (): Promise<AssessmentHistory> => {
      return await apiClient(`${API_ENDPOINTS.CONCERN_ASSESSMENT}/${id}`, {
        method: "GET",
        credentials: "include",
      });
    },
    enabled: !!id,
    retry: false,
  });

  return assessment.data;
}
