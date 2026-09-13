import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";
import type { CareTypes, ScheduleRecommendation } from "@/types/care_events";
import { useMutation } from "@tanstack/react-query";

export default function useScheduleRecommendations() {
  const generateScheduleRecommendations = () => {
    return useMutation({
      mutationKey: ["ai_schedule_recommendations"],
      mutationFn: async ({
        plantId,
        care_type,
      }: {
        plantId: number;
        care_type: CareTypes;
      }): Promise<ScheduleRecommendation> =>
        await apiClient(API_ENDPOINTS.GET_SCHEDULE_RECOMMENDATIONS(plantId), {
          method: "POST",
          body: JSON.stringify({ care_type }),
        }),
    });
  };
  return { generateScheduleRecommendations };
}
