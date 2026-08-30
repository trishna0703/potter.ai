export interface Plant {
  id: number;
  name: string | null;
  species: string;
  height_cm: number | null;
  pot_size: number | null;
  added_on: string;
  location_type: string | null;
  status: "ACTIVE" | "INACTIVE";
  avatar: string | null;
  avatar_id: number | null;
}

export interface PlantCreate {
  name?: string | null;
  species: string;
  location_type?: string | null;
  height_cm?: number | null;
  pot_size?: number | null;
  added_on: string; // YYYY-MM-DD
  avatar_id?: number | null;
  status?: string | null;
}

export interface PlantUpdate {
  name?: string | null;
  species?: string | null;
  location_type?: string | null;
  height_cm?: number | null;
  pot_size?: number | null;
  added_on?: string | null;
  avatar_id?: number | null;
  status?: string | null;
}

export type PlantPhotoUploadResponse = {
  photo_id: number;
  evidence_id: number;
};

export type UploadPlantPhotoRequest = {
  photo_url: string;
  captured_on: string;
  plant_id: number;
};
