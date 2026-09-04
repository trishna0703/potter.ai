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
