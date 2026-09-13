import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useEventSchedules from "../hooks/useEventSchedules";
import CustomBreadcrumb from "#components/layout/Breadcrumb";
import usePlant from "../hooks/usePlant";
import { Skeleton } from "#components/ui/skeleton";
import { Button } from "#components/ui/button";
import { Calendar, Plus } from "lucide-react";

import CareScheduleCard from "./components/CareScheduleCard";
import ScheduleHero from "./components/ScheduleHero";
import { CareScheduleDialog } from "#components/utils/CareScheduleDialog";
import {
  type ScheduleRecommendation,
  type UpdateScheduleType,
} from "@/types/care_events";
import CareTip from "./components/CareTip";
import useScheduleRecommendations from "../hooks/useScheduleReommendations";

const Schedules = () => {
  const params = useParams();
  const plantId = Number(params?.plant_id);
  const { getPlantDetail } = usePlant();
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [shouldPrefill, setShouldPrefill] = useState<boolean>(false);
  const { generateScheduleRecommendations } = useScheduleRecommendations();
  const {
    mutateAsync: generateSchedules,
    isPending: isLoadingRecommendations,
  } = generateScheduleRecommendations();
  const [recommendedSchedules, setRecommendedSchedules] =
    useState<ScheduleRecommendation>();
  const {
    getAllSchedules,
    updateSchedule,
    deleteSchedule,
    invalidateSchedules,
  } = useEventSchedules();
  const { data: plant, isLoading: isPlantLoading } = getPlantDetail(
    Number(plantId),
  );

  const { data: schedules, isLoading: isSchedulesLoading } = getAllSchedules(
    Number(plantId),
  );

  useEffect(() => {
    if ((!schedules || !schedules.length) && !isSchedulesLoading) {
      generateSchedules({ plantId, care_type: "WATER" }).then((res) => {
        setRecommendedSchedules(res);
        console.log({ res });
      });
    }
  }, [plantId, schedules]);

  const handleUpdate = async (
    scheduleId: number,
    payload: UpdateScheduleType,
  ) => {
    await updateSchedule(scheduleId, payload);
    invalidateSchedules(plantId);
  };

  const handleDelete = async (scheduleId: number) => {
    await deleteSchedule(scheduleId);
    invalidateSchedules(plantId);
  };

  const isLoading = isPlantLoading || isSchedulesLoading;

  if (isLoading) {
    return <CareSchedulesSkeleton />;
  }

  if (!plant) {
    return <div className="p-6 text-center">Plant not found.</div>;
  }
  return (
    <div className="mx-auto w-full max-w-6xl">
      <CustomBreadcrumb
        config={{
          plants: {
            label: "Plants",
            path: "/plants",
          },
          schedules: {
            label: "Care Schedules",
            path: "/plants",
          },
          [String(plantId)]: {
            label: plant?.name ?? "Plant",
          },
        }}
      />

      <div className="mt-5">
        <ScheduleHero
          plantName={plant.name ?? "Your plant"}
          species={plant.species}
          imageUrl={plant.avatar}
        />
      </div>

      <section className="mt-8 bg-card rounded-xl md:p-6 p-2">
        <div className="flex gap-4 flex-row items-center justify-between">
          <div className="flex gap-4">
            <Calendar className="text-green-700 mt-1 sm:flex hidden" />
            <div>
              <h2 className="text-lg md:text-2xl font-semibold tracking-tight">
                {plant.name ? `${plant.name}'s` : "Your plant's"} care schedules
              </h2>

              <p className="mt-1 text-muted-foreground text-xs">
                {schedules && schedules.length > 0
                  ? `${schedules.length} reminder${schedules.length > 1 ? "s" : ""} for a healthier, happier ${plant.name ?? plant.species ?? "plant"}`
                  : "Set up gentle reminders for your plant."}
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowEventDialog(true)}
            className={"sm:flex hidden"}
          >
            Add Schedule
          </Button>
          <Button
            onClick={() => setShowEventDialog(true)}
            className={"sm:hidden flex"}
          >
            <Plus /> Add
          </Button>
        </div>
        {isLoadingRecommendations && (
          <div className="p-4 rounded-2xl border flex gap-4 mt-2 items-center">
            <img src="/loading.svg" alt="" className="size-10" />
            <p className="text-muted-foreground text-sm">
              Analysing your plant's needs...
            </p>
          </div>
        )}
        {schedules && schedules.length === 0 ? (
          <div className="space-y-2 pt-2">
            {recommendedSchedules ? (
              <ScheduleRecommendationCard
                schedule={{
                  ...recommendedSchedules,
                  plantName: plant.name,
                  species: plant.species,
                }}
                saveSchedule={() => {
                  setShowEventDialog(true);
                  setShouldPrefill(true);
                }}
              />
            ) : null}
            <EmptyScheduleState />
          </div>
        ) : (
          <div className="mt-5 grid gap-4">
            {schedules &&
              schedules.map((schedule) => (
                <CareScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
          </div>
        )}
        <div className="mt-6">
          <CareTip />
        </div>
      </section>

      <CareScheduleDialog
        open={showEventDialog}
        onOpenChange={setShowEventDialog}
        plantId={plantId}
        onCreated={() => {
          invalidateSchedules(plantId);
          setRecommendedSchedules(undefined);
        }}
        prefillData={shouldPrefill ? recommendedSchedules : null}
      />
    </div>
  );
};

export default Schedules;

function ScheduleRecommendationCard({
  schedule,
  saveSchedule,
}: {
  schedule: ScheduleRecommendation & {
    plantName: string | null;
    species: string;
  };
  saveSchedule: () => void;
}) {
  return (
    <div className="p-4 rounded-2xl border flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <h3 className="text-md font-semibold">
            Recommended {schedule.care_type} schedule for{" "}
            {schedule.plantName ?? `your ${schedule.species}`}
          </h3>
          <p className="text-sm">
            <span className="text-muted-foreground">Every:</span>{" "}
            <span className="text-primary text-medium">
              {schedule.interval} {schedule.frequency_type}
            </span>
          </p>
        </div>
        <Button variant={"secondary"} onClick={saveSchedule}>
          Save Schedule
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">{schedule.reasoning}</p>
      <p className="bg-terracotta/20 rounded-xl text-xs text-muted-foreground p-3">
        Keep in mind: This is a suggested schedule based on your plant's details
        and species needs. If it doesn't work for your routine, you can reject
        it and set your own schedule.
      </p>
    </div>
  );
}
function EmptyScheduleState() {
  return (
    <div className="mt-5 rounded-2xl border border-dashed p-8 text-center">
      <div className="mx-auto max-w-sm">
        <h3 className="font-medium">No care schedules yet</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Add a reminder for watering, fertilizing, or anything else your plant
          needs.
        </p>
      </div>
    </div>
  );
}

function CareSchedulesSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <Skeleton className="h-5 w-48" />

      <Skeleton className="mt-5 h-65 w-full rounded-2xl" />

      <div className="mt-8">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-2 h-5 w-72" />

        <div className="mt-5 grid gap-4">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    </main>
  );
}
