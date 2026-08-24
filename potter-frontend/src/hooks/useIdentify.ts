import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";
import type { PlantIdentificationResponse } from "@/store/PlantIdentificationStore";

import { useMutation } from "@tanstack/react-query";

type IdentifyPayload = {
  photo_url: string;
  captured_on: string;
  plant_id?: number;
};

const identifyPlant = async (
  payload: IdentifyPayload,
): Promise<PlantIdentificationResponse> => {
  return await apiClient(API_ENDPOINTS.IDENTIFY, {
    method: "POST",
    body: JSON.stringify(payload),
    credentials: "include",
  });
};

const useIdentify = () => {
  return useMutation({
    mutationFn: identifyPlant,
  });
};

export default useIdentify;
