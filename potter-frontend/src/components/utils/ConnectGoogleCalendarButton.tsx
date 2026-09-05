import { Button } from "#components/ui/button";

import { CheckIcon } from "lucide-react";

const ConnectGoogleCalendarButton = ({

  status,
  returnTo
}: {
  status: boolean;
  returnTo: string
}) => {
  const handleConnectGoogleCalendar = async () => {


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
      size={"xs"}
    >
      Connect Calendar
    </Button>
  );
};

export default ConnectGoogleCalendarButton;
