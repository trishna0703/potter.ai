import {
  ChevronRight,
  EllipsisVertical,
  LeafIcon,
  MessageCircleWarning,
} from "lucide-react";

import { HouseIcon, PottedPlantIcon, RulerIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Plant } from "@/types/plantTypes";
import { useState, type ChangeEvent } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#components/ui/dropdown-menu";
import PhotoPicker from "#components/utils/PhotoPicker";
import { S3_URL } from "#lib/routes";

export type PlantStatus = "ALIVE" | "DEAD";

interface PlantCardProps {
  plant: Plant;
  isHealthy?: boolean;
  editPlant: (plant: Plant) => void;
  raiseConcern: (
    event: ChangeEvent<HTMLInputElement, Element>,
    id: number,
    species: string,
  ) => void;
  markPlantDead: (id: number) => Promise<void>;
  triggerCareEvent: (id: number) => void;
}

function formatMeasurement(value: number | null, unit: string | null) {
  if (value === null || !unit) {
    return "—";
  }

  return `~${value} ${unit}`;
}

export default function PlantCard({
  plant,
  isHealthy,
  editPlant,
  raiseConcern,
  markPlantDead,
  triggerCareEvent,
}: PlantCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-[1.15] h-48 w-full overflow-hidden bg-muted">
        {plant.avatar ? (
          <img
            src={S3_URL + "/" + plant.avatar}
            alt={plant.name ?? plant.species}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
            No photo
          </div>
        )}

        {/* Health badge */}
        <div className="absolute left-3 top-3">
          <Badge
            variant="secondary"
            className={
              isHealthy
                ? "border-0 bg-secondary text-primary hover:bg-secondary/90"
                : "border-0 bg-yellow-100 text-ochre hover:bg-yellow-200"
            }
          >
            {isHealthy ? <LeafIcon /> : <MessageCircleWarning />}
            {isHealthy ? "Healthy" : "Needs attention"}
          </Badge>
        </div>

        {/* Menu */}
        <div className="absolute right-3 top-3">
          {plant.status === "ACTIVE" ? (
            <PlantMenu
              {...{
                plant,
                editPlant,

                markPlantDead,
                triggerCareEvent,
              }}
              raiseConcern={(event) =>
                raiseConcern(event, plant.id, plant.species)
              }
            />
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-2">
        <h3 className="truncate text-lg font-semibold text-foreground">
          {plant.name}
        </h3>

        <p className="truncate text-xs text-muted-foreground">
          {plant.species}
        </p>

        {/* Metadata */}
        <div className="mt-4 flex items-center gap-4 justify-between text-xs text-muted-foreground">
          <div className="flex min-w-0 items-center gap-1">
            <RulerIcon size={20} weight="light" />
            <span>{formatMeasurement(plant.height_cm, "cm")}</span>
          </div>

          <div className="flex min-w-0 items-center gap-1">
            <PottedPlantIcon size={20} weight="light" />
            <span>
              {plant.pot_size !== null ? `~${plant.pot_size} in` : "—"}
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-1">
            <HouseIcon size={20} weight="light" />
            <span className="truncate">
              {plant.location_type === "INDOOR" ? "Indoor" : "Outdoor"}
            </span>
          </div>
        </div>

        <Link
          to={`/plants/schedules/${plant.id}`}
          className="gap-1 mt-3 text-primary text-xs border-[0.5px] rounded-full p-1.5 bg-muted/40 flex justify-center items-center"
        >
          View Care
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

const PlantMenu = ({
  plant,
  editPlant,
  raiseConcern,
  markPlantDead,
  triggerCareEvent,
}: {
  plant: Plant;
  editPlant: (plant: Plant) => void;
  raiseConcern: (event: ChangeEvent<HTMLInputElement, Element>) => void;
  markPlantDead: (id: number) => Promise<void>;
  triggerCareEvent: (id: number) => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
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

      <DropdownMenuContent className="w-44">
        <DropdownMenuGroup>
          <PhotoPicker
            onPhotoSelected={raiseConcern}
            onOpenChange={(open) => {
              if (!open) setMenuOpen(false);
            }}
          >
            <span className="cursor-pointer text-sm py-1 px-1.5 hover:bg-terracotta/20 w-full text-left inline-block rounded-md">
              Raise Concern
            </span>
          </PhotoPicker>
          <DropdownMenuItem
            className={"hover:bg-terracotta/20 cursor-pointer"}
            onClick={() => triggerCareEvent(plant.id)}
          >
            Add Care
          </DropdownMenuItem>

          <DropdownMenuItem
            className={"hover:bg-terracotta/20 cursor-pointer"}
            onClick={() => editPlant(plant)}
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            className={"hover:bg-terracotta/20 cursor-pointer"}
            onClick={() => markPlantDead(plant.id)}
          >
            Mark dead
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuItem className={"hover:bg-terracotta/20 cursor-pointer"}>
          Delete
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
