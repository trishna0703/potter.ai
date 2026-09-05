type FrequencyType = "DAYS" | "WEEKS";

export interface CareScheduleFormData {
  careType: string | null;
  description: string;
  frequencyType: FrequencyType;
  interval: string;
  scheduledTime: string;
  startsOn: Date;
  endsOn?: Date;
  autoSchedule: boolean;
  timezone: string;
}

export interface CareSchedule {
  id: number;
  plant_id: number;
  care_type: string;
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
