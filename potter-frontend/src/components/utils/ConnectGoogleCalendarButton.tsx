import { Button } from "#components/ui/button";

import { CheckIcon } from "lucide-react";

const ConnectGoogleCalendarButton = ({
  plantId,
  status,
}: {
  plantId: number;
  status: boolean;
}) => {
  const handleConnectGoogleCalendar = async () => {
    const returnTo =
      window.location.pathname +
      `?process=care-event-scheduler&plantId=${plantId}`;

    window.location.href = `/api/integrations/google-calendar/connect?return_to=${encodeURIComponent(returnTo)}`;
  };

  return status ? (
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
