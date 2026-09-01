import { useState } from "react";
import { Sprout } from "lucide-react";
import { Button } from "#components/ui/button";
import PhotoPicker from "#components/utils/PhotoPicker";
import IdentifiedPlantModal from "#components/utils/IdentifiedPlantModal";

import Overlay from "#components/layout/Overlay";
import usePhotoUpload from "@/routes/HealthConcerns/hooks/usePhotoUpload";
import useIdentify from "#hooks/useIdentify";
import usePlantIdentityStore from "@/store/PlantIdentificationStore";
import usePlantStore from "@/store/PlantStore";
import { getToday } from "#lib/utils";

const NoPlantsFound = () => {
  const { handleFileChange } = usePhotoUpload();
  const { mutateAsync: runAIIdentification } = useIdentify();
  const {  setPlantIdentity } = usePlantIdentityStore();
  const { setShowForm } = usePlantStore();
  const [isLoadingIdentification, setIsLoadingIdentification] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
          <Sprout className="size-10 text-primary" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-semibold">No plants found</h2>
          <p className="max-w-sm text-sm text-gray-500">
            Your shelf is looking a little empty. Add your first plant to start
            tracking its care routine.
          </p>
        </div>

        <PhotoPicker onPhotoSelected={onPhotoSelected}>
          <Button className="cursor-pointer">Add new plant</Button>
        </PhotoPicker>
      </div>

      {isLoadingIdentification ? <Overlay /> : null}

      <IdentifiedPlantModal
        createPlant={() => setShowForm(true)}
        {...{ isOpen, setIsOpen }}
      />

    </>
  );
};

export default NoPlantsFound;
