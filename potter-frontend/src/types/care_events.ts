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
