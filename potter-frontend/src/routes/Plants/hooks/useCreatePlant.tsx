import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";
import type { Plant } from "@/types/plantTypes";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import usePlant from "./usePlant";

interface PlantFormData {
  name: string;
  species: string;
  location_type: string | undefined;
  height_cm: string;
  pot_size: string;
}

const initialFormData: PlantFormData = {
  name: "",
  species: "",
  location_type: undefined,
  height_cm: "",
  pot_size: "",
};

const createPlant = async (
  plant_data: Partial<Plant>,
  method: string,
): Promise<Plant> => {
  const response = await apiClient(API_ENDPOINTS.PLANTS, {
    method: method,
    body: JSON.stringify(plant_data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.detail || "Failed to create plant");
  }

  return response.json();
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
  plant?: Plant;
  onClose: () => void;
}) => {
  const { mutateAsync: createNewPlant } = useCreateOrUpdatePlant();
  const [formData, setFormData] = useState<PlantFormData>(initialFormData);
  const { invalidate } = usePlant();

  useEffect(() => {
    if (plant) {
      setFormData({
        name: plant.name || "",
        species: plant.species,
        location_type: plant.location_type ?? undefined,
        height_cm: plant.height_cm?.toString() || "",
        pot_size: plant.pot_size?.toString() || "",
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const added_on = new Date().toISOString().split("T")[0];
    const payload: Partial<Plant> = {
      name: formData.name || null,
      species: formData.species,
      location_type: formData.location_type ?? undefined,
      height_cm: formData.height_cm ? Number(formData.height_cm) : null,
      pot_size: formData.pot_size ? Number(formData.pot_size) : null,
      added_on,
    };

    if (plant) {
      payload["id"] = plant.id;
    }

    let newPlant = await createNewPlant({
      plant_data: payload,
      method: plant ? "PATCH" : "POST",
    });
    toast(`${newPlant.name} has been added to your shelf.`);

    invalidate.plants();
    invalidate.plantDetails(newPlant.id);
    onClose();
  };

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  return { handleChange, handleSubmit, handleClose, formData };
};
