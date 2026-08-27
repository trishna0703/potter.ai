import type { AIRecommendationResponse } from "@/types/recommendation";
import { create } from "zustand";

interface RecommendationStore {
  recommendationOptions: AIRecommendationResponse | null;

  assessmentId: string | number | null;

  setRecommendationOptions: (
    assessmentId: string | number,
    recommendations: AIRecommendationResponse,
  ) => void;

  clearRecommendationOptions: () => void;
}

export const useRecommendationStore = create<RecommendationStore>()((set) => ({
  recommendationOptions: null,
  assessmentId: null,

  setRecommendationOptions: (assessmentId, recommendations) =>
    set({ assessmentId, recommendationOptions: recommendations }),

  clearRecommendationOptions: () =>
    set({
      recommendationOptions: null,
    }),
}));
