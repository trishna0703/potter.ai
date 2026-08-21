import type { Plant } from "@/types/plantTypes";
import { create } from "zustand";

export interface PlantIdentificationResponse {
  evidence_id: number;
  photo_id: number;
  is_new_plant: boolean;
  found_plants: Plant[];
  species: string;
  confidence: number;
  plant_id?: number;
  photo_url: string | null;
  concern_id?: number;
}

interface PlantIdentificationState {
  plantIdentity: PlantIdentificationResponse | null;
  setPlantIdentity: (concern: PlantIdentificationResponse | null) => void;
}

const usePlantIdentityStore = create<PlantIdentificationState>()((set) => ({
  plantIdentity: null,
  setPlantIdentity: (concern) => set({ plantIdentity: concern }),
}));

export default usePlantIdentityStore;
