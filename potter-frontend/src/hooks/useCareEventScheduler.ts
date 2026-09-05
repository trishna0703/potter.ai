import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";
import type { CareScheduleFormData } from "@/types/care_events";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

const timezoneAliases: Record<string, string> = {
  "Asia/Calcutta": "Asia/Kolkata",
};

const timezone =
  timezoneAliases[Intl.DateTimeFormat().resolvedOptions().timeZone] ??
  Intl.DateTimeFormat().resolvedOptions().timeZone;

const initialFormData: CareScheduleFormData = {
  careType: null,
  description: "",
  frequencyType: "DAYS",
  interval: "1",
  scheduledTime: "20:00",
  startsOn: new Date(),
  endsOn: undefined,
  autoSchedule: false,
  timezone: timezone,
};

const usecareEventScheduler = () => {
  const [formData, setFormData] =
    useState<CareScheduleFormData>(initialFormData);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData(initialFormData);
    setError(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    console.log({ name, value });
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleScheduleCareEvent = async (plantId: number) => {
    if (!formData.careType) {
      setError("Please select a care type.");
      return;
    }

    const parsedInterval = Number(formData.interval);

    if (!Number.isInteger(parsedInterval) || parsedInterval <= 0) {
      setError("Interval must be a positive whole number.");
      return;
    }

    if (formData.endsOn && formData.endsOn < formData.startsOn) {
      setError("End date cannot be before the start date.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let payload = {
        care_type: formData.careType,
        description: formData.description || null,
        frequency_type: formData.frequencyType,
        interval: parsedInterval,
        scheduled_time: `${formData.scheduledTime}:00`,
        timezone: formData.timezone,
        starts_on: format(formData.startsOn, "yyyy-MM-dd"),
        ends_on: formData.endsOn ? format(formData.endsOn, "yyyy-MM-dd") : null,
        auto_schedule: formData.autoSchedule,
      };

      await apiClient(API_ENDPOINTS.SCHEDULE_CARE_EVENT(plantId), {
        method: "POST",
        body: JSON.stringify(payload),
      });

      resetForm();
      toast.success(`Care event scheduled successfully!`);
    } catch (err) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleScheduleCareEvent,
    formData,
    setFormData,
    isSubmitting,
    error,
    resetForm,
    handleChange,
  };
};

export default usecareEventScheduler;
