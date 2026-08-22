export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/",
  PLANTS: "/plants",
  SHELVES: "/shelves",
  CONCERNS: "/concerns",
  CONCERNSACTIVE: `/concerns/active`,
  RAISE: "/concerns/raise",
} as const;

export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const API_URL = import.meta.env.VITE_API_URL;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const S3_URL = import.meta.env.VITE_S3_URL;
