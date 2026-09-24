import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";
import type { CareEventType } from "@/types/care_events";
import { useQuery } from "@tanstack/react-query";

export default function useCareEventHistory() {
  const getEventHistory = (plantId: number) => {
    return useQuery({
      queryKey: ["care-event-history", plantId],
      queryFn: async (): Promise<CareEventType[]> => {
        return await apiClient(API_ENDPOINTS.CARE_EVENTS_HISTORY(plantId), {
          method: "GET",
        });
      },
      enabled: !!plantId,
    });
  };

  return {
    getEventHistory,
  };
}
