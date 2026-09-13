import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "#components/ui/drawer";
import { Button } from "#components/ui/button";
import useEventNotifier from "../../hooks/useEventNotifier";
import {
  BellIcon,
  ClockIcon,
  SpinnerGapIcon,
  XIcon,
} from "@phosphor-icons/react";
import type {
  CareTypes,
  PendingEvents,
  UpdateEventPayloadType,
} from "@/types/care_events";
import type { UseMutationResult } from "@tanstack/react-query";
import { formatOccurredOn, getCareEventSubtitle } from "#lib/utils";

const PendingEventsDrawer = () => {
  const { getPendingEvents, updatePendingEvent } = useEventNotifier();
  const { data: pendingEvents, isLoading, isError } = getPendingEvents();

  return (
    <Drawer swipeDirection="right">
      <DrawerTrigger
        className={"relative size-9"}
        render={
          <Button size="icon" variant={"outline"} className={"rounded-full"} />
        }
      >
        <BellIcon size={28} className="text-muted-foreground" />
        {pendingEvents && pendingEvents.length > 0 ? (
          <span className="absolute size-4 top-0 -right-1 bg-terracotta text-terracotta-foreground text-xs rounded-full flex items-center justify-center">
            {pendingEvents.length}
          </span>
        ) : null}
      </DrawerTrigger>
      <DrawerContent className={"sm:w-lg w-full"}>
        <DrawerHeader>
          <div className="flex justify-between items-center">
            <DrawerTitle className={"text-playfair font-bold text-3xl"}>
              Notifications
            </DrawerTitle>
            <DrawerClose>
              <XIcon />
            </DrawerClose>
          </div>
          <DrawerDescription>
            Handle all updates in one place.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 max-h-[100vh - 5rem] overflow-y-scroll no-scrollbar">
          {!isLoading && !pendingEvents?.length && (
            <div className="text-sm text-muted-foreground">
              No new updates. Check back later.
            </div>
          )}
          {isLoading && <SpinnerGapIcon className="loader" />}
          {isError && (
            <div className="text-xs">
              Oops! We failed to load your notifications. Try again later.
            </div>
          )}

          <div className="space-y-2">
            {pendingEvents &&
              pendingEvents.map((event) => (
                <SingleEvent
                  event={event}
                  key={event.id}
                  updateEvent={updatePendingEvent}
                />
              ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default PendingEventsDrawer;

const getEventIcon = (type: CareTypes) => {
  switch (type) {
    case "WATER":
      return "/icons/water.png";
    case "FERTILIZER":
    case "COMPOST":
      return "/icons/fertilize.png";
    case "PRUNING":
      return "/icons/prune.png";
    case "SUNBATHING":
      return "/icons/sunbath.png";
    case "REPOT":
      return "/icons/repot.png";
    case "OTHER":
      return "/icons/plant-icon.png";
    default:
      return "/icons/plant-icon.png";
  }
};

const SingleEvent = ({
  event,
  updateEvent,
}: {
  event: PendingEvents;
  updateEvent: () => UseMutationResult<
    any,
    Error,
    UpdateEventPayloadType,
    unknown
  >;
}) => {
  const { mutateAsync, isError, isPending } = updateEvent();
  const handleAnswer = async (value: boolean) => {
    await mutateAsync({
      plant_id: event.plant_id,
      event_id: event.id,
      source: event.source,
      was_action_taken: value,
    });
  };

  return (
    <div className="border-[0.5px] p-2.5 rounded-xl">
      <div
        aria-label={`${event.care_type}-event-for-${event.plant_name}}`}
        className="flex gap-2 sm:items-center sm:flex-row flex-col"
      >
        <div className="flex items-center gap-2">
          <span className="shrink-0 size-16 p-2 rounded-full bg-secondary/30 border-[0.5px] border-secondary">
            <img
              src={getEventIcon(event.care_type)}
              alt={`${event.care_type} event icon`}
            />
          </span>
          <div className="space-y-1 flex-1">
            {event.care_type === "OTHER" ? (
              <h3 className="text-md font-semibold">
                Did you do the other activity for {event.plant_name}?
              </h3>
            ) : (
              <h3 className="text-md font-semibold">
                Did you {event.care_type.toLocaleLowerCase()} {event.plant_name}
                ?
              </h3>
            )}
            {event.care_type != "OTHER" && (
              <p className="text-muted-foreground text-xs">
                {getCareEventSubtitle(event.care_type, event.plant_name)}
              </p>
            )}
            <span className="text-xs flex items-center gap-1 text-muted-foreground mt-2">
              <ClockIcon size={14} />
              {formatOccurredOn(event.occurred_on)}
            </span>
          </div>
        </div>

        <div className="flex gap-3 ms-auto shrink-0">
          <Button onClick={() => handleAnswer(true)} disabled={isPending}>
            Yes
          </Button>
          <Button
            onClick={() => handleAnswer(false)}
            disabled={isPending}
            variant={"outline"}
          >
            No
          </Button>
        </div>
      </div>
      {isError && (
        <p className="text-destructive text-xs">
          Failed to update. Please try again.
        </p>
      )}
    </div>
  );
};
