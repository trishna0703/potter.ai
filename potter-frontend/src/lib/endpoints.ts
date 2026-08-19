import { API_URL } from "./routes";

/** Add application endpoints here as they are defined. */
export const API_ENDPOINTS = {
  ROOT: `${API_URL}/`,
  USER: `${API_URL}/users/me`,
  LOGIN: `${API_URL}/auth/google`,
  PLANTS: `${API_URL}/plants`,
  PLANT: (id: number) => `${API_URL}/plants/${id}`,
  CREATE_PLANT: `${API_URL}/plants/add`,
  SHELVES: `${API_URL}/shelves`,
  GET_SHELF: (id: number) => `${API_URL}/shelves/${id}`,
};
