import { ROUTES, S3_URL } from "#lib/routes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import usePlantIdentityStore from "@/store/PlantIdentificationStore";
import type { Plant } from "@/types/plantTypes";
import { useNavigate } from "react-router-dom";

export const NewPlantDialog = ({
  createPlant,
}: {
  createPlant: () => void;
}) => {
  return (
    <div>
      <p>Hey, that looks like a new plant</p>
      <h3>You can save the plant now and update later.</h3>
      <Button variant={"destructive"}>Don't save</Button>
      <Button onClick={createPlant}>Save plant</Button>
    </div>
  );
};

const PlantsList = ({
  plants,
  setPlant,
}: {
  plants: Plant[];
  setPlant: (id: number, photo: string | null) => void;
}) => {
  const navigate = useNavigate();
  return (
    <div className=" py-8">
      {plants.map((plant) => (
        <div className="flex gap-4">
          <img
            src={S3_URL + "/" + plant.avatar}
            alt={plant.name ?? plant.species}
            className="size-36 object-cover shadow-md bg-card rounded-2xl"
          />

          <div>
            <h3>{plant.name}</h3>
            <div className="flex gap-2 items-start flex-col pt-2">
              <div className="flex gap-2 items-center text-xs">
                <p className="text-ochre">Species:</p>
                <p className="text-ink">{plant.species}</p>
              </div>
              <div className="flex gap-2 items-center text-xs">
                <p className="text-ochre">Height:</p>
                <p className="text-ink">~{plant.height_cm} cm</p>
              </div>
              <div className="flex gap-2 items-center text-xs">
                <p className="text-ochre">Pot Size:</p>
                <p className="text-ink">~{plant.pot_size} in</p>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => {
                  navigate(`/plant/${plant.id}`);
                  // add post call to update plant_photo with plant_id
                }}
                variant={"outline"}
              >
                Select
              </Button>
              <Button
                onClick={() => {
                  setPlant(plant.id, plant.avatar);
                }}
              >
                Raise
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const NewPlantForm = () => {
  const { plantIdentity } = usePlantIdentityStore();

  return (
    <>
      <DialogHeader>
        <DialogTitle>New Plant Detected</DialogTitle>
        <DialogDescription>
          Hey, this looks like a{" "}
          {!plantIdentity?.species
            ? "new plant."
            : `new ${plantIdentity?.species}`}
          .
        </DialogDescription>
      </DialogHeader>

      {plantIdentity?.photo_url ? (
        <img
          src={S3_URL + "/" + plantIdentity?.photo_url}
          alt=""
          className="size-24 mx-auto rounded-xl shadow-md object-cover"
        />
      ) : null}

      <div className="text-ink/70 pb-4">
        <label>Want to add this to your shelf?</label>

        <p>
          You can add <strong>plant now</strong> or{" "}
          <strong>raise concern</strong> and update the plant later.
        </p>
      </div>
    </>
  );
};

const DuplicatePlantList = ({
  handleRaise,
}: {
  handleRaise: (id?: number) => void;
}) => {
  const { plantIdentity, setPlantIdentity } = usePlantIdentityStore();
  const isNew = plantIdentity?.is_new_plant;
  const species = plantIdentity?.species;
  const plants = plantIdentity?.found_plants;
  return (
    <>
      <div>
        {" "}
        <DialogHeader>
          <DialogTitle>Identified Duplicate Plants</DialogTitle>
          <DialogDescription>
            Hey, this looks like a {species}.{" "}
            {plants && !isNew
              ? `We found ${plants.length} ${species}${plants.length > 1 ? "'s" : ""} in your account.`
              : null}
          </DialogDescription>
        </DialogHeader>
        {plantIdentity?.found_plants ? (
          <PlantsList
            plants={plantIdentity.found_plants}
            setPlant={(id, photo) => {
              setPlantIdentity({
                ...plantIdentity,
                plant_id: id,
                photo_url: photo,
              });
              handleRaise(id);
            }}
          />
        ) : null}
        <div className="text-ink/70 pb-4">
          <label>None of these? Want to add as a new one?</label>

          <p>
            You can add <strong>plant now</strong> or{" "}
            <strong>raise concern</strong> and update the plant later.
          </p>
        </div>
      </div>
    </>
  );
};

const ModalFooter = ({
  createPlant,
  setIsOpen,
  handleRaise,
}: {
  createPlant: () => void;
  setIsOpen: (open: boolean) => void;
  handleRaise: (id?: number) => void;
}) => {
  const { plantIdentity, setPlantIdentity } = usePlantIdentityStore();
  return (
    <DialogFooter className="">
      <DialogClose
        render={
          <Button
            variant="outline"
            onClick={() => {
              if (plantIdentity) {
                setPlantIdentity({
                  ...plantIdentity,
                  species: "",
                  plant_id: undefined,
                });
              }
              setIsOpen(false);
              createPlant();
            }}
          >
            Not {plantIdentity?.species}?
          </Button>
        }
        className={"ms-auto"}
      />
      <Button
        type="submit"
        onClick={() => {
          createPlant();
          setIsOpen(false);
        }}
        variant={"secondary"}
      >
        Add Plant
      </Button>
      <Button onClick={() => handleRaise()}>Raise Concern</Button>
    </DialogFooter>
  );
};
export default function IdentifiedPlantModal({
  createPlant,
  setIsOpen,
  isOpen,
}: {
  createPlant: () => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) {
  const { plantIdentity } = usePlantIdentityStore();

  const isNew = plantIdentity?.is_new_plant;
  const navigate = useNavigate();
  const handleRaise = (id?: number) => {
    setIsOpen(false);
    if (id) {
      navigate(ROUTES.RAISE + `?plant=${id}&step=1`);
      return;
    }
    navigate(ROUTES.RAISE + "?step=1");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-sm">
        {isNew ? <NewPlantForm /> : <DuplicatePlantList {...{ handleRaise }} />}
        <ModalFooter {...{ createPlant, handleRaise, setIsOpen }} />
      </DialogContent>
    </Dialog>
  );
}
