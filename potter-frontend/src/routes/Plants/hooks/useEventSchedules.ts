import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";
import type { CareSchedule, UpdateScheduleType } from "@/types/care_events";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function useEventSchedules() {
  const client = useQueryClient();
  const getAllSchedules = (plantId: number) => {
    return useQuery({
      queryKey: ["plant-care-schedules", plantId],
      queryFn: async (): Promise<CareSchedule[]> => {
        return await apiClient(
          API_ENDPOINTS.GET_ALL_SCHEDULES_FOR_PLANT(plantId),
          {
            method: "GET",
          },
        );
      },
      enabled: !!plantId,
    });
  };

  const getSchedule = async (schedule_id: number) => {
    return await apiClient(API_ENDPOINTS.GET_SCHEDULE_BY_ID(schedule_id), {
      method: "GET",
    });
  };

  const updateSchedule = async (
    schedule_id: number,
    payload: UpdateScheduleType,
  ) => {
    return await apiClient(API_ENDPOINTS.SCHEDULE_CARE_EVENT(schedule_id), {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  };

  const deleteSchedule = async (schedule_id: number) => {
    return await apiClient(API_ENDPOINTS.SCHEDULE_CARE_EVENT(schedule_id), {
      method: "DELETE",
    });
  };

  const invalidateSchedules = (plantId: number) => {
    client.invalidateQueries({ queryKey: ["plant-care-schedules", plantId] });
  };

  return {
    getAllSchedules,
    getSchedule,
    updateSchedule,
    deleteSchedule,
    invalidateSchedules,
  };
}
