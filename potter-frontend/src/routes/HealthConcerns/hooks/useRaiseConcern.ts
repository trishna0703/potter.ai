import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";
import { useMutation } from "@tanstack/react-query";

interface RaiseConcernPayload {
  submission_id: string;
  photo_id: number;
  initial_context: string;
  occurred_on: string;
  evidence_id: number;
  plant_id?: number;
}

interface NewConcernResponse {
  concern_id: number;
  assessment_id: number;
}

interface ReassessPayload {
  concern_id: number;
}

interface ReassessResponse {
  assessment_id: number;
}

const useRaiseConcern = () => {
  const raiseConcern = () => {
    return useMutation({
      mutationKey: ["raise-concern"],
      mutationFn: async (
        payload: RaiseConcernPayload,
      ): Promise<NewConcernResponse> =>
        await apiClient(API_ENDPOINTS.CONCERN_ASSESSMENT, {
          method: "POST",
          body: JSON.stringify(payload),
        }),
    });
  };

  const reassess = async (
    payload: ReassessPayload,
  ): Promise<ReassessResponse> => {
    return await apiClient(API_ENDPOINTS.CONCERN_REASSESS, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  };

  const markConcernResolved = async (id: number) => {
    return await apiClient(`/api/concerns/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "COMPLETED" }),
    });
  };

  return {
    raiseConcern,
    reassess,
    markConcernResolved,
  };
};

export default useRaiseConcern;
