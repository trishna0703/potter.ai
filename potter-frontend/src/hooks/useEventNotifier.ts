import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";
import type {
  PendingEvents,
  UpdateEventPayloadType,
} from "@/types/care_events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useEventNotifier() {
  const client = useQueryClient();
  const getPendingEvents = () => {
    return useQuery({
      queryKey: ["pending-events"],
      queryFn: async (): Promise<PendingEvents[]> =>
        await apiClient(API_ENDPOINTS.PENDING_EVENTS_FOR_UPDATES, {
          method: "GET",
        }),
    });
  };

  const updatePendingEvent = () => {
    return useMutation({
      mutationKey: ["update-pending-event"],
      mutationFn: async (payload: UpdateEventPayloadType) =>
        await apiClient(
          API_ENDPOINTS.UPDATE_PENDING_EVENT_STATUS(
            payload.plant_id,
            payload.event_id,
          ),
          {
            method: "PATCH",
            body: JSON.stringify({
              source: payload.source,
              was_action_taken: payload.was_action_taken,
            }),
          },
        ),
      onSuccess: async () => await invalidatePendingEvents(),
    });
  };

  const invalidatePendingEvents = () => {
    client.invalidateQueries({
      queryKey: ["pending-events"],
    });
  };

  return { getPendingEvents, updatePendingEvent };
}
