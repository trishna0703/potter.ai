import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";
import type { Plant } from "@/types/plantTypes";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import usePlant from "./usePlant";
import usePhotoUpload from "@/routes/HealthConcerns/hooks/usePhotoUpload";
import { getToday } from "#lib/utils";

interface PlantFormData {
  name: string;
  species: string;
  location_type: string | undefined;
  height_cm: string;
  pot_size: string;
  avatar_id?: number | null;
  avatar?: string | null;
  added_on: string | null;
}

const initialFormData: PlantFormData = {
  name: "",
  species: "",
  location_type: undefined,
  height_cm: "",
  pot_size: "",
  avatar_id: null,
  added_on: null,
  avatar: null,
};

const createPlant = async (
  plant_data: Partial<Plant>,
  method: string,
): Promise<Plant> => {
  return await apiClient(API_ENDPOINTS.PLANTS, {
    method: method,
    body: JSON.stringify(plant_data),
    credentials: "include",
  });
};

export const useCreateOrUpdatePlant = () => {
  return useMutation({
    mutationFn: ({
      plant_data,
      method,
    }: {
      plant_data: Partial<Plant>;
      method: string;
    }) => createPlant(plant_data, method),
  });
};

export const useCreatePlantOperations = ({
  plant,
  onClose,
}: {
  plant?: Partial<Plant>;
  onClose: () => void;
}) => {
  const { mutateAsync: createNewPlant } = useCreateOrUpdatePlant();
  const [formData, setFormData] = useState<PlantFormData>(initialFormData);
  const { invalidate } = usePlant();
  const { handleFileChange } = usePhotoUpload();

  useEffect(() => {
    if (plant) {
      setFormData({
        name: plant.name || "",
        species: plant.species || "",
        location_type: plant.location_type || undefined,
        height_cm: plant.height_cm?.toString() || "",
        pot_size: plant.pot_size?.toString() || "",
        avatar_id: plant.avatar_id,
        added_on: plant.added_on ?? getToday(),
        avatar: plant.avatar,
      });
    }
  }, [plant]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let photo_url = await handleFileChange(e);
    if (photo_url) setFormData((prev) => ({ ...prev, avatar: photo_url }));
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: Partial<Plant> = {
      name: formData.name || null,
      species: formData.species,
      location_type: formData.location_type ?? undefined,
      height_cm: formData.height_cm ? Number(formData.height_cm) : null,
      pot_size: formData.pot_size ? Number(formData.pot_size) : null,
      avatar_id: formData.avatar_id,
      added_on: formData.added_on ?? getToday(),
      status: "ACTIVE",
    };

    if (plant && plant.id) {
      payload["id"] = plant.id;
    }

    try {
      let newPlant = await createNewPlant({
        plant_data: payload,
        method: plant?.id ? "PATCH" : "POST",
      });

      toast(`${newPlant.name} has been added to your shelf.`);

      invalidate.plants();
      invalidate.plantDetails(newPlant.id);
      onClose();
    } catch (e) {
      toast(
        `Ohh no, we couldn't add ${formData.name ?? "your plant"}. Please try again.`,
      );
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  return {
    handleChange,
    handleSubmit,
    handleClose,
    formData,
    handleSelectChange,
    handleFileUpload,
  };
};
