import type { CareTypes } from "@/types/care_events";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getToday() {
  return new Date().toISOString().split("T")[0];
}

export function showErrorToast(error: any) {
  if (error instanceof Error) {
    return toast.error(error.message);
  }

  return toast.error(String(error));
}

export const formatLabel = (value: string): string => {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export function formatOccurredOn(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  if (targetDate.getTime() === today.getTime()) {
    return "Today";
  }

  if (targetDate.getTime() === yesterday.getTime()) {
    return "Testerday";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function getCareEventSubtitle(
  careType: CareTypes,
  plantName: string,
): string {
  if (careType === "WATER")
    return `Keeping the soil moist helps ${plantName} thrive!`;
  if (careType === "FERTILIZER" || careType === "COMPOST")
    return `A regular nutrition will help ${plantName} growing and glowing!`;

  if (careType === "PRUNING")
    return `Regular pruning keeps ${plantName} grow healthier roots and fresh leaves.`;
  if (careType === "REPOT")
    return `Like humans, plants need more room to grow. Let's upgrade ${plantName} to a 2BHK.`;
  if (careType === "SUNBATHING")
    return `Light keeps ${plantName} well fed. Don't forget.`;

  return "";
}
