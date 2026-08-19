import { API_ENDPOINTS } from "#lib/endpoints";
import { useMutation } from "@tanstack/react-query";

export interface CreatePlantPayload {
  name?: string | null;
  species: string;
  location_type?: "INDOOR" | "OUTDOOR";
  height_cm?: number | null;
  pot_size?: number | null;
}

export interface Plant {
  name: string | null;
  species: string;
  location_type: "INDOOR" | "OUTDOOR" | null;
  height_cm: number | null;
  pot_size: number | null;
}

const createPlant = async (plant_data: CreatePlantPayload): Promise<Plant> => {
  const response = await fetch(API_ENDPOINTS.CREATE_PLANT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(plant_data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.detail || "Failed to create plant");
  }

  return response.json();
};

export const useCreatePlant = () => {
  return useMutation({
    mutationFn: createPlant,
  });
};
