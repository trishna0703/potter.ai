import type { Plant } from "@/types/plantTypes";
import { create } from "zustand";

interface PlantState {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  draftPlant: Partial<Plant> | null;
  setDraftPlant: (plant: Partial<Plant>) => void;
}

const usePlantStore = create<PlantState>()((set) => ({
  showForm: false,
  setShowForm: (show) => set({ showForm: show }),
  draftPlant: null,
  setDraftPlant: (plant) => set({ draftPlant: plant }),
}));

export default usePlantStore;
