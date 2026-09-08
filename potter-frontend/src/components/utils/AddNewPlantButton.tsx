import useIdentify from "#hooks/useIdentify";
import { getToday } from "#lib/utils";
import usePhotoUpload from "@/routes/HealthConcerns/hooks/usePhotoUpload";
import CreatePlantForm from "@/routes/Plants/components/CreatePlantForm";
import usePlantIdentityStore from "@/store/PlantIdentificationStore";
import React, { useMemo, useState } from "react";
import PhotoPicker from "./PhotoPicker";
import Overlay from "#components/layout/Overlay";
import IdentifiedPlantModal from "./IdentifiedPlantModal";

const AddNewPlantButton = ({ children }: { children?: React.ReactNode }) => {
  const { handleFileChange } = usePhotoUpload();
  const { mutateAsync: runAIIdentification } = useIdentify();
  const { plantIdentity, setPlantIdentity } = usePlantIdentityStore();
  const [isLoadingIdentification, setIsLoadingIdentification] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const onPhotoSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsLoadingIdentification(true);
    const photo_url = await handleFileChange(event);

    if (photo_url) {
      const identified_data = await runAIIdentification({
        photo_url,
        captured_on: getToday(),
      });
      setPlantIdentity({ ...identified_data, photo_url });
    }

    setIsLoadingIdentification(false);
    setIsOpen(true);
  };

  const newPlant = useMemo(
    () => ({
      avatar_id: plantIdentity?.photo_id,
      added_on: getToday(),
      species: plantIdentity?.species,
      avatar: plantIdentity?.photo_url,
    }),
    [plantIdentity?.photo_id, plantIdentity?.species, plantIdentity?.photo_url],
  );

  return (
    <>
      {children ? (
        <PhotoPicker {...{ onPhotoSelected }}>{children}</PhotoPicker>
      ) : (
        <PhotoPicker {...{ onPhotoSelected }} />
      )}

      {isLoadingIdentification ? <Overlay /> : null}

      <CreatePlantForm
        plant={newPlant}
        open={showForm}
        onClose={() => setShowForm(false)}
      />

      <IdentifiedPlantModal
        createPlant={() => setShowForm(true)}
        {...{ isOpen, setIsOpen }}
      />
    </>
  );
};

export default AddNewPlantButton;
