import { API_URL } from "./routes";

/** Add application endpoints here as they are defined. */
export const API_ENDPOINTS = {
  ROOT: `${API_URL}/`,
  USER: `${API_URL}/users/me`,
  LOGIN: `${API_URL}/auth/google`,
  PLANTS: `${API_URL}/plants/`,
  PLANT: (id: number) => `${API_URL}/plants/${id}`,
  SHELVES: `${API_URL}/shelves/`,
  GET_SHELF: (id: number) => `${API_URL}/shelves/${id}`,
  PRESIGN_UPLOAD: `${API_URL}/uploads/presign`,
  UPLOAD: `${API_URL}/uploads/`,
  CONCERNS: `${API_URL}/concerns/`,
  CONCERNS_INACTIVE: `${API_URL}/concerns/inactive`,
  CONCERN_ASSESSMENT: `${API_URL}/concerns/assessment`,
  CONCERN_REASSESS: `${API_URL}/concerns/reassessment`,
  MESSAGES: (id: number) => `${API_URL}/concerns/${id}/messages`,
  ASSESSMENT_WS: `${API_URL}/concern/ws`,
  IDENTIFY: `${API_URL}/identify/`,
  LOGOUT: `${API_URL}/auth/logout`,
  RECOMMENDATIONS: `${API_URL}/concerns/recommendations`,
};
