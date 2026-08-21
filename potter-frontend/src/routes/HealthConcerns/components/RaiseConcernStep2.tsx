import { Button } from "#components/ui/button";
import { S3_URL } from "#lib/routes";
import { useCreateOrUpdatePlant } from "@/routes/Plants/hooks/useCreatePlant";
import usePlant from "@/routes/Plants/hooks/usePlant";
import usePlantIdentityStore from "@/store/PlantIdentificationStore";
import { useSearchParams } from "react-router-dom";

const NewPlantDialog = ({
  createPlant,
}: {
  createPlant: () => Promise<void>;
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
const RaiseConcernStep2 = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { plantIdentity } = usePlantIdentityStore();
  const { mutateAsync: createNewPlant } = useCreateOrUpdatePlant();
  const { invalidate } = usePlant();

  const createPlant = async () => {
    let payload = {
      species: plantIdentity?.species,
      avatar_id: plantIdentity?.photo_id,
      added_on: new Date().toISOString().split("T")[0],
    };
    await createNewPlant({
      plant_data: payload,
      method: "POST",
    });
    invalidate.plants();
    params.set("step", "3");
    setSearchParams(params);
  };

  if (plantIdentity?.is_new_plant) {
    return <NewPlantDialog {...{ createPlant }} />;
  }
  return (
    <div>
      <p>Hey! That looks like your </p>
      <div className="grid grid-cols-3">
        {plantIdentity?.found_plants.map((plant) => {
          return (
            <div key={plant.id}>
              <img
                src={S3_URL + "/" + plant.avatar}
                alt=""
                className="w-32 h-32"
              />
              <p>{plant.name ?? plant.species}</p>
            </div>
          );
        })}
      </div>

      <h3>
        If this is a new plant, you can save the plant now and update later.
      </h3>
      <Button variant={"destructive"}>Don't save</Button>
      <Button onClick={createPlant}>Save plant</Button>
    </div>
  );
};

export default RaiseConcernStep2;
