export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/",
  PLANTS: "/plants",
  SHELVES: "/shelves",
} as const;

export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const API_URL = import.meta.env.VITE_API_URL;
