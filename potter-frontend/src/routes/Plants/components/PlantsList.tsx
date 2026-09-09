import type { Plant } from "@/types/plantTypes";
import CreatePlantForm from "./CreatePlantForm";
import { useEffect, useState, type ChangeEvent } from "react";
import { ROUTES } from "#lib/routes";
import { useNavigate, useSearchParams } from "react-router-dom";
import usePlantIdentityStore from "@/store/PlantIdentificationStore";
import usePhotoUpload from "@/routes/HealthConcerns/hooks/usePhotoUpload";
import { getToday, showErrorToast } from "#lib/utils";
import { useCreateOrUpdatePlant } from "../hooks/useCreatePlant";
import usePlant from "../hooks/usePlant";
import NoPlantsFound from "./NoPlantsFound";
import { CareScheduleDialog } from "#components/utils/CareScheduleDialog";
import PlantCard from "./PlantCard";
import AddNewPlantButton from "#components/utils/AddNewPlantButton";
import { PlantIcon, PlusIcon } from "@phosphor-icons/react";
import Overlay from "#components/layout/Overlay";

const PlantsList = ({
  plantList,
  unhealthyPlants,
}: {
  plantList: Plant[];
  unhealthyPlants: number[] | undefined;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [editPlant, setEditPlant] = useState<Plant | undefined>(undefined);
  const [showcareEventDialog, setShowCareEventDialog] = useState<{
    plantId: number | null;
    show: boolean;
  }>({
    plantId: null,
    show: false,
  });
  const { mutateAsync: markPlantdead } = useCreateOrUpdatePlant();
  const { invalidate } = usePlant();

  const { plantIdentity, setPlantIdentity } = usePlantIdentityStore();
  const { handleFileChange, handleUploadPlantPhoto } = usePhotoUpload();
  const navigate = useNavigate();
  const [isRaisePending, setIsRaisePending] = useState(false);

  const raiseConcern = async (
    event: ChangeEvent<HTMLInputElement, Element>,
    id: number,
    species: string,
  ) => {
    setIsRaisePending(true);
    try {
      let new_evidence = await handleFileChange(event);

      if (new_evidence) {
        let { photo_id, evidence_id } = await handleUploadPlantPhoto({
          photo_url: new_evidence,
          captured_on: getToday(),
          plant_id: id,
        });
        setPlantIdentity({
          ...plantIdentity,
          photo_id,
          evidence_id,
          plant_id: id,
          photo_url: new_evidence,
          is_new_plant: false,
          species: species,
          confidence: 10,
          found_plants: [],
        });
        setIsRaisePending(false);
        navigate(ROUTES.RAISE);
      }
    } catch (err) {
      showErrorToast(err);
    }
  };

  const handleMarkPlantDead = async (id: number) => {
    try {
      await markPlantdead({
        plant_data: { status: "INACTIVE", id },
        method: "PATCH",
      });

      invalidate.plants();
    } catch (error) {
      showErrorToast(error);
    }
  };

  useEffect(() => {
    if (
      params.get("process") === "care-event-scheduler" &&
      params.get("plantId")
    ) {
      setShowCareEventDialog({
        plantId: Number(params.get("plantId")),
        show: true,
      });

      params.delete("process");
      params.delete("plantId");
      params.delete("calendar");

      setSearchParams(params, { replace: true });
    }
  }, [params.get("process")]);

  if (!plantList.length) {
    return <NoPlantsFound />;
  }

  return (
    <>
      {isRaisePending ? <Overlay /> : null}
      <div className="w-full">
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 gap-4">
          {plantList?.map((plant: Plant) => (
            <li key={plant.id} className="w-full">
              <PlantCard
                plant={plant}
                editPlant={(plant: Plant) => setEditPlant(plant)}
                markPlantDead={handleMarkPlantDead}
                triggerCareEvent={(id: number) =>
                  setShowCareEventDialog({ plantId: id, show: true })
                }
                raiseConcern={raiseConcern}
                isHealthy={
                  plant.status === "ACTIVE" &&
                  !unhealthyPlants?.includes(plant.id)
                }
              />
            </li>
          ))}
          {plantList.length % 4 != 0 ? (
            <>
              <AddPlantCard />
            </>
          ) : null}
          {(plantList.length + 2) % 4 == 0 ? (
            <>
              <FillerCard />
            </>
          ) : null}
        </ul>
        <CreatePlantForm
          open={!!editPlant}
          onClose={() => setEditPlant(undefined)}
          plant={editPlant}
        />
        <CareScheduleDialog
          open={showcareEventDialog.show}
          onOpenChange={(val) =>
            setShowCareEventDialog({ plantId: null, show: val })
          }
          plantId={showcareEventDialog.plantId || 0}
        />
      </div>
    </>
  );
};

export default PlantsList;

const AddPlantCard = () => {
  return (
    <article className="h-full w-full border-dashed border flex items-center justify-center rounded-2xl flex-col p-4 gap-6">
      <div className="flex flex-col gap-2 items-center">
        <span className="bg-secondary flex justify-center items-center rounded-full size-16">
          <PlantIcon className="text-primary" size={32} weight="light" />
        </span>
        <h3 className="text-md font-medium">Add a new plant</h3>
        <p className="text-xs text-muted-foreground">
          Start tracking care, growth and memories.
        </p>
      </div>
      <AddNewPlantButton>
        <span className="button-custom bg-secondary! text-primary! font-medium">
          <PlusIcon size={16} /> Add Plant
        </span>
      </AddNewPlantButton>
    </article>
  );
};

const FillerCard = () => {
  return (
    <article className="h-full w-full rounded-2xl">
      <img
        src="/filler-card.png"
        className="size-full object-cover rounded-2xl"
        alt="filler-card-image"
      />
    </article>
  );
};
