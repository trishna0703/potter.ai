import type {
  CareEventType,
  UpdateEventPayloadType,
} from "@/types/care_events";
import useCareEventHistory from "../../hooks/useCareEventHistory";
import { formatOccurredOn, getEventIcon, getRelativeTime } from "#lib/utils";
import { CheckIcon, XIcon } from "@phosphor-icons/react";
import useEventNotifier from "#hooks/useEventNotifier";
import type { UseMutationResult } from "@tanstack/react-query";
import { Button } from "#components/ui/button";

const CareEventHistory = ({ plantId }: { plantId: number }) => {
  const { getEventHistory } = useCareEventHistory();
  const { updatePendingEvent } = useEventNotifier();

  const { data: events, isLoading, isError } = getEventHistory(plantId);

  if (isLoading) {
    return "Loading...";
  }

  if (isError) {
    return "Failed to load history. Check back later.";
  }

  return (
    <div className="border-[0.5px] border-muted p-4 my-10 rounded-2xl">
      <div className="flex gap-4 items-center pb-4">
        <img src="/icons/plant-icon.png" className="w-16" />
        <div className="space-y-1">
          <h3 className="text-playfair text-4xl font-medium text-primary/80">
            Event history
          </h3>
          <p className="text-sm text-muted-foreground">
            Track the past care events in one place.
          </p>
        </div>
      </div>

      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="whitespace-nowrap min-w-160 w-full flex items-center justify-between bg-secondary/40 rounded-lg p-2.5">
          <div className="w-1/4 sm:w-1/3 uppercase text-xs text-muted-foreground/60">
            Care Type
          </div>
          <div className="w-1/4 uppercase text-xs text-muted-foreground/60">
            Date
          </div>
          <div className="w-1/4 uppercase text-xs text-muted-foreground/60 text-center">
            Performed
          </div>
          <div className="w-1/4 sm:w-1/6 uppercase text-xs text-muted-foreground/60 text-left">
            Pending Action
          </div>
        </div>
        {events && events.length ? (
          <div className="min-w-160 w-full">
            {events.map((event) => (
              <EventHistoryRow {...{ event, updatePendingEvent }} />
            ))}
          </div>
        ) : (
          <div className="py-4 w-full flex justify-center items-center text-muted-foreground text-sm">
            No care history found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CareEventHistory;

const EventHistoryRow = ({
  event,
  updatePendingEvent,
}: {
  event: CareEventType;
  updatePendingEvent: () => UseMutationResult<
    any,
    Error,
    UpdateEventPayloadType,
    unknown
  >;
}) => {
  const { mutateAsync, isPending } = updatePendingEvent();
  const handleAnswer = async (value: boolean) => {
    await mutateAsync({
      plant_id: event.plant_id,
      event_id: event.id,
      source: event.source,
      was_action_taken: value,
    });
  };
  return (
    <div className="flex justify-between items-center my-2 border-b-[0.5px] border-secondary/30 p-2">
      <div className="flex items-center gap-4 w-1/4 sm:w-1/3">
        <span className="size-14 p-2 rounded-full bg-secondary/30 border-[0.5px] border-secondary">
          <img
            src={getEventIcon(event.care_type)}
            alt={`${event.care_type} event icon`}
            className="size-full"
          />
        </span>
        <span className="capitalize text-playfair text-md font-semibold">
          {event.care_type.toLocaleLowerCase()}
        </span>
      </div>
      <div className=" flex flex-col gap-1 w-1/4">
        <span className="text-sm">
          {formatOccurredOn(event.occurred_on, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        <span className="text-xs text-muted-foreground">
          {getRelativeTime(event.occurred_on)}
        </span>
      </div>
      <div className="flex justify-center w-1/4">
        {event.status === "DONE" ? (
          event.was_action_taken ? (
            <span className="flex justify-center items-center bg-secondary rounded-full size-6">
              <CheckIcon weight="light" />
            </span>
          ) : (
            <span className="flex items-center justify-center bg-muted rounded-full size-6">
              <XIcon weight="light" />
            </span>
          )
        ) : (
          "-"
        )}
      </div>

      <div className="flex justify-start w-1/4 sm:w-1/6 ps-2">
        {event.status === "INCOMPLETE" ? (
          <div className="flex gap-3">
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
        ) : (
          "-"
        )}
      </div>
    </div>
  );
};
