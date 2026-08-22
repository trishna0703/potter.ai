import { API_BASE_URL, API_URL } from "./routes";

/** Add application endpoints here as they are defined. */
export const API_ENDPOINTS = {
  ROOT: `${API_URL}/`,
  USER: `${API_URL}/users/me`,
  LOGIN: `${API_URL}/auth/google`,
  PLANTS: `${API_URL}/plants/`,
  PLANT: (id: number) => `${API_URL}/plants/${id}`,
  SHELVES: `${API_URL}/shelves`,
  GET_SHELF: (id: number) => `${API_URL}/shelves/${id}`,
  PRESIGN_UPLOAD: `${API_URL}/uploads/presign`,
  UPLOAD: `${API_URL}/uploads`,
  CONCERN: `${API_URL}/concerns`,
  MESSAGES: (id: number) => `${API_URL}/concerns/${id}/messages`,
  ASSESSMENT_WS: `${API_BASE_URL}/api/concern/ws`,
  IDENTIFY: `${API_URL}/identify`,
  LOGOUT: `${API_URL}/auth/logout`,
};
