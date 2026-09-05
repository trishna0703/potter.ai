import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";
import { useQuery } from "@tanstack/react-query";

export default function useCalendarConnectionStatus() {
  return useQuery({
    queryKey: ["calendarConnectionStatus"],
    queryFn: async () =>
      await apiClient(API_ENDPOINTS.CALENDAR_CONNECTION_STATUS),
  });
}
