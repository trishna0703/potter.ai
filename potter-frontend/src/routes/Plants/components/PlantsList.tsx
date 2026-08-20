import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "#components/ui/card";
import type { Plant } from "@/types/plantTypes";
import usePlant from "../hooks/usePlant";
import { Avatar, AvatarFallback, AvatarImage } from "#components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#components/ui/dropdown-menu";

import { Button } from "#components/ui/button";
import { EllipsisVertical } from "lucide-react";
import CreatePlantForm from "./CreatePlantForm";
import { useState } from "react";

const Bullet = () => <span className="w-1 h-1 bg-ochre rounded-full"></span>;

const PlantMenu = ({
  plant,
  editPlant,
}: {
  plant: Plant;
  editPlant: (plant: Plant) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full cursor-pointer"
          >
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => editPlant(plant)}>
            edit
          </DropdownMenuItem>
          <DropdownMenuItem>mark as dead</DropdownMenuItem>
          <DropdownMenuItem>concerns</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const PlantCard = ({
  plant,
  editPlant,
}: {
  plant: Plant;
  editPlant: (plant: Plant) => void;
}) => {
  return (
    <Card>
      <CardHeader className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={plant.avatar as string} />
          <AvatarFallback>{plant.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle>{plant.name}</CardTitle>
        <CardAction className="ml-auto">
          <PlantMenu {...{ plant, editPlant }} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 items-start flex-col">
          <div className="flex gap-2 items-center">
            <Bullet />
            <p className="text-ochre">Species:</p>
            <p className="text-ink">{plant.species}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Bullet />
            <p className="text-ochre">Height:</p>
            <p className="text-ink">~{plant.height_cm} cm</p>
          </div>
          <div className="flex gap-2 items-center">
            <Bullet />
            <p className="text-ochre">Pot Size:</p>
            <p className="text-ink">~{plant.pot_size} in</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
const PlantsList = () => {
  const { allPlants } = usePlant();
  const { data: plantList, isLoading, isError } = allPlants;
  const [editPlant, setEditPlant] = useState<Plant | undefined>(undefined);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred while fetching plants.</div>;
  }

  return (
    <div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {plantList?.map((plant: Plant) => (
          <li key={plant.id}>
            <PlantCard
              plant={plant}
              editPlant={(plant: Plant) => setEditPlant(plant)}
            />
          </li>
        ))}
      </ul>
      <CreatePlantForm
        open={!!editPlant}
        onClose={() => setEditPlant(undefined)}
        plant={editPlant}
      />
    </div>
  );
};

export default PlantsList;
