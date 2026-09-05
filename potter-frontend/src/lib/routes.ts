export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/",
  PLANTS: "/plants",
  SHELVES: "/shelves",
  CONCERNS: "/concerns",
  CONCERNSACTIVE: `/concerns/active`,
  RAISE: "/concerns/raise",
  SCHEDULES: "/plants/schedules",
} as const;

export const API_URL = "/api";
export const S3_URL = import.meta.env.VITE_S3_URL;
