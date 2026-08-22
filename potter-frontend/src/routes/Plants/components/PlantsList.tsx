import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "#components/ui/card";
import type { Plant } from "@/types/plantTypes";
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
import { S3_URL } from "#lib/routes";

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
            variant="outline"
            className="relative h-8 w-8 rounded-full cursor-pointer text-muted-foreground/80 bg-card"
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
    <Card className="bg-transparent! border-none! shadow-none! ring-0 w-full">
      <CardHeader className="flex items-center gap-4 relative z-1">
        {/* <Avatar>
          <AvatarImage src={(S3_URL + "/" + plant.avatar) as string} />
          <AvatarFallback>{plant.name?.charAt(0)}</AvatarFallback>
        </Avatar> */}
        <img
          src={S3_URL + "/" + plant.avatar}
          alt={plant.name ?? plant.species}
          className="size-full h-58 object-cover shadow-md bg-card rounded-2xl"
        />
        <CardAction className="ml-auto absolute right-0 -top-3 z-2">
          <PlantMenu {...{ plant, editPlant }} />
        </CardAction>
      </CardHeader>
      <CardContent className="bg-card w-3/4 rounded-b-2xl mx-auto p-4 pt-6 -translate-y-6 shadow-md">
        <CardTitle>{plant.name}</CardTitle>
        <div className="flex gap-2 items-start flex-col pt-2">
          <div className="flex gap-2 items-center text-xs">
            <Bullet />
            <p className="text-ochre">Species:</p>
            <p className="text-ink">{plant.species}</p>
          </div>
          <div className="flex gap-2 items-center text-xs">
            <Bullet />
            <p className="text-ochre">Height:</p>
            <p className="text-ink">~{plant.height_cm} cm</p>
          </div>
          <div className="flex gap-2 items-center text-xs">
            <Bullet />
            <p className="text-ochre">Pot Size:</p>
            <p className="text-ink">~{plant.pot_size} in</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
const PlantsList = ({ plantList }: { plantList: Plant[] }) => {
  const [editPlant, setEditPlant] = useState<Plant | undefined>(undefined);

  return (
    <div className="w-full">
      <ul className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 grid-cols-1">
        {plantList?.map((plant: Plant) => (
          <li key={plant.id} className="w-full">
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
