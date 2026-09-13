type FrequencyType = "DAYS" | "WEEKS";

export type CareTypes =
  | "WATER"
  | "FERTILIZER"
  | "REPOT"
  | "COMPOST"
  | "PRUNING"
  | "SUNBATHING"
  | "OTHER";

export interface CareScheduleFormData {
  careType: CareTypes | null;
  description: string | null;
  frequencyType: FrequencyType;
  interval: number;
  scheduledTime: string;
  startsOn: Date;
  endsOn?: Date;
  autoSchedule: boolean;
  timezone: string;
  recommendation_id?: number;
}

export interface CareSchedulePayload {
  care_type: CareTypes;
  description: string | null;
  frequency_type: FrequencyType;
  interval: number;
  scheduled_time: string;
  timezone: string;
  starts_on: string;
  ends_on: string | null;
  auto_schedule: boolean;
  recommendation_id?: number;
}

export interface CareSchedule {
  id: number;
  plant_id: number;
  care_type: CareTypes;
  description: string | null;
  frequency_type: FrequencyType;
  interval: number;
  scheduled_time: string;
  timezone: string;
  starts_on: string;
  ends_on: string | null;
  is_active: boolean;
  auto_schedule: boolean | null;
  created_at: string;
  updated_at: string;
}

export type UpdateScheduleType = {
  description?: string | null;
  frequency_type?: string;
  interval?: number;
  scheduled_time?: string;
  timezone?: string;
  is_active?: boolean;
  auto_schedule?: boolean;
};

export type EventSourceType = "CARE_EVENT" | "CALENDAR_EVENT";
export interface PendingEvents {
  id: number;
  source: EventSourceType;
  plant_id: number;
  plant_name: string;
  care_type: CareTypes;
  occurred_on: string;
}

export interface UpdateEventPayloadType {
  plant_id: number;
  event_id: number;
  source: EventSourceType;
  was_action_taken: boolean;
}

export type ScheduleRecommendation = {
  id: number;
  interval: number;
  care_type: CareTypes;
  frequency_type: FrequencyType;
  reasoning: string | null;
  plant_id: number;
};
