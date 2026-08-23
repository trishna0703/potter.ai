import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";
import type { PlantIdentificationResponse } from "@/store/PlantIdentificationStore";

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
const useRaiseConcern = () => {
  const raiseConcern = async (
    payload: RaiseConcernPayload,
  ): Promise<NewConcernResponse> => {
    return await apiClient(API_ENDPOINTS.CONCERN, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  };

  return {
    raiseConcern,
  };
};

export default useRaiseConcern;
