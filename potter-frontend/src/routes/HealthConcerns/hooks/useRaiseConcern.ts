import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";

interface RaiseConcernPayload {
  photo_url: string;
  occurred_on: string;
  initial_context: string;
}

const useRaiseConcern = () => {
  const raiseConcern = async (payload: RaiseConcernPayload) => {
    const response = await apiClient(API_ENDPOINTS.CONCERN, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to raise concern");
    }

    return response.json();
  };

  return {
    raiseConcern,
  };
};

export default useRaiseConcern;
