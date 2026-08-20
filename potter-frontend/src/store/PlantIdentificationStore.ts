import type { Plant } from "@/types/plantTypes";
import { create } from "zustand";

export interface PlantIdentificationResponse {
  concern_id: number;
  evidence_id: number;
  photo_id: number;
  isNewPlant: boolean;
  foundPlants: Plant[];
}

interface PlantIdentificationState {
  plantIdentity: PlantIdentificationResponse | null;
  setPlantIdentity: (concern: PlantIdentificationResponse) => void;
}

const usePlantIdentityStore = create<PlantIdentificationState>()((set) => ({
  plantIdentity: null,
  setPlantIdentity: (concern) => set({ plantIdentity: concern }),
}));

export default usePlantIdentityStore;
