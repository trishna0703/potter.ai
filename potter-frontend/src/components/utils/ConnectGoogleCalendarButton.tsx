import { Button } from "#components/ui/button";
import useCalendarConnectionStatus from "#hooks/useCalendarConnectionStatus";
import apiClient from "#lib/client";
import { CheckIcon } from "lucide-react";

const ConnectGoogleCalendarButton = ({ plantId }: { plantId: number }) => {
  const { data: connection } = useCalendarConnectionStatus();
  const handleConnectGoogleCalendar = async () => {
    await apiClient(
      "/api/integrations/google-calendar/connect?return_to=" +
        encodeURIComponent(
          window.location.pathname +
            `?process=care-event-scheduler&plantId=${plantId}`,
        ),
      {
        method: "GET",
      },
    );
  };

  return connection?.connected ? (
    <span className="flex items-center gap-2 justify-center border-[0.5px] border-success rounded-md p-1 text-xs w-max">
      <CheckIcon className="size-3 text-success" /> Calendar Connected
    </span>
  ) : (
    <Button
      variant="outline"
      onClick={handleConnectGoogleCalendar}
      className="w-max"
    >
      Connect Google Calendar
    </Button>
  );
};

export default ConnectGoogleCalendarButton;
