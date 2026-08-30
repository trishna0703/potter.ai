import { useState } from "react";
import { HeartPulse } from "lucide-react";
import { Button } from "#components/ui/button";
import PhotoPicker from "#components/utils/PhotoPicker";
import IdentifiedPlantModal from "#components/utils/IdentifiedPlantModal";
import Overlay from "#components/layout/Overlay";
import usePhotoUpload from "@/routes/HealthConcerns/hooks/usePhotoUpload";
import useIdentify from "#hooks/useIdentify";
import usePlantIdentityStore from "@/store/PlantIdentificationStore";
import usePlantStore from "@/store/PlantStore";
import CreatePlantForm from "@/routes/Plants/components/CreatePlantForm";
import { getToday } from "#lib/utils";

const NoConcernFound = () => {
  const { handleFileChange } = usePhotoUpload();
  const { mutateAsync: runAIIdentification } = useIdentify();
  const { plantIdentity, setPlantIdentity } = usePlantIdentityStore();
  const { showForm, setShowForm } = usePlantStore();
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
          <HeartPulse className="size-10 text-primary" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-semibold">No concerns found</h2>
          <p className="max-w-sm text-sm text-gray-500">
            Your plants are looking healthy. Raise a concern if you notice
            something off with one of them.
          </p>
        </div>

        <PhotoPicker onPhotoSelected={onPhotoSelected}>
          <Button className="cursor-pointer">Raise a concern</Button>
        </PhotoPicker>
      </div>

      {isLoadingIdentification ? <Overlay /> : null}

      <IdentifiedPlantModal
        createPlant={() => setShowForm(true)}
        {...{ isOpen, setIsOpen }}
      />

      <CreatePlantForm
        plant={{
          avatar_id: plantIdentity?.photo_id,
          added_on: getToday(),
          species: plantIdentity?.species,
          avatar: plantIdentity?.photo_url,
        }}
        open={showForm}
        onClose={() => setShowForm(false)}
      />
    </>
  );
};

export default NoConcernFound;
