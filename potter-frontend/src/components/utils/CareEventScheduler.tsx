import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#components/ui/dialog";
import { Label } from "#components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select";
import { Textarea } from "#components/ui/textarea";
import { Input } from "#components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#components/ui/popover";
import { Button } from "#components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "#components/ui/calendar";
import { Switch } from "#components/ui/switch";
import { format } from "date-fns";
import usecareEventScheduler from "#hooks/useCareEventScheduler";
import ConnectGoogleCalendarButton from "./ConnectGoogleCalendarButton";
import useCalendarConnectionStatus from "#hooks/useCalendarConnectionStatus";

type FrequencyType = "DAYS" | "WEEKS";

interface CareScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plantId: number;
  onCreated?: () => void;
}

export function CareScheduleDialog({
  open,
  onOpenChange,
  plantId,
  onCreated,
}: CareScheduleDialogProps) {
  if (!open) return null;
  const { data: calendarConnection } = useCalendarConnectionStatus();

  const {
    handleScheduleCareEvent,
    formData,
    handleChange,
    setFormData,
    isSubmitting,
    error,
  } = usecareEventScheduler();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleScheduleCareEvent(plantId);
    onOpenChange(false);
    onCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full sm:max-w-xl h-auto max-h-dvh pb-0">
        <DialogHeader>
          <DialogTitle>Schedule plant care</DialogTitle>

          <DialogDescription>
            Create a recurring care schedule for this plant.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="border-t-[0.5px] py-4">
          <div className="max-h-[60dvh] overflow-y-auto no-scrollbar space-y-5">
            {/* Care type */}
            <div className="px-1 space-y-2">
              <Label htmlFor="care-type">Care type</Label>

              <Select
                value={formData.careType}
                name="careType"
                onValueChange={(value) =>
                  handleChange({
                    target: {
                      name: "careType",
                      value: value,
                    },
                  } as any)
                }
              >
                <SelectTrigger id="care-type" className="w-full">
                  <SelectValue placeholder="Select care type" />
                </SelectTrigger>

                <SelectContent className="p-1">
                  <SelectItem value="WATER">Water</SelectItem>
                  <SelectItem value="FERTILIZER">Fertilize</SelectItem>
                  <SelectItem value="REPOT">Repot</SelectItem>
                  <SelectItem value="COMPOST">Add compost</SelectItem>
                  <SelectItem value="PRUNING">Prune</SelectItem>
                  <SelectItem value="SUNBATHING">Sunbathing</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              {" "}
              {/* Frequency */}
              <div className="px-1 space-y-2 w-1/2">
                <Label>Repeat every</Label>

                <div className="grid grid-cols-[100px_1fr] gap-3">
                  <Input
                    type="number"
                    name="interval"
                    min={1}
                    step={1}
                    value={formData.interval}
                    onChange={handleChange}
                    className="w-full"
                  />

                  <Select
                    value={formData.frequencyType}
                    name="frequencyType"
                    onValueChange={(value: FrequencyType | null) =>
                      handleChange({
                        target: {
                          name: "frequencyType",
                          value: value as FrequencyType,
                        },
                      } as any)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent className="p-1">
                      <SelectItem value="DAYS">Days</SelectItem>
                      <SelectItem value="WEEKS">Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Time */}
              <div className="px-1 space-y-2 w-1/2">
                <Label
                  htmlFor="scheduled-time"
                  className="flex items-center justify-between"
                >
                  Reminder time{" "}
                  <p className="text-[9px] text-muted-foreground">
                    Timezone: {formData.timezone}
                  </p>
                </Label>

                <Input
                  id="scheduled-time"
                  name="scheduledTime"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="px-1 space-y-2 w-1/2">
                <Label>Start date</Label>

                <Popover>
                  <PopoverTrigger className={"w-full"}>
                    <span className="w-full justify-start text-left font-normal flex items-center border-[0.5px] rounded-md p-1.5">
                      <CalendarIcon className="mr-2 h-4 w-4" />

                      {format(formData.startsOn, "PPP")}
                    </span>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startsOn}
                      onSelect={(date) => {
                        if (date) {
                          setFormData((prev) => ({ ...prev, startsOn: date }));

                          if (formData.endsOn && formData.endsOn < date) {
                            setFormData((prev) => ({
                              ...prev,
                              endsOn: undefined,
                            }));
                          }
                        }
                      }}
                      disabled={{ before: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {/* End date */}
              <div className="px-1 space-y-2 w-1/2">
                <Label>
                  End date
                  <span className="ml-1 text-muted-foreground">(optional)</span>
                </Label>

                <Popover>
                  <PopoverTrigger className="w-full">
                    <span className="w-full justify-start text-left font-normal flex items-center border-[0.5px] rounded-md p-1.5">
                      <CalendarIcon className="mr-2 h-4 w-4" />

                      {formData.endsOn
                        ? format(formData.endsOn, "PPP")
                        : "No end date"}
                    </span>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endsOn}
                      onSelect={(date) => {
                        if (date) {
                          setFormData((prev) => ({ ...prev, endsOn: date }));
                        }
                      }}
                      disabled={{
                        before: formData.startsOn,
                      }}
                    />

                    {formData.endsOn && (
                      <div className="border-t p-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              endsOn: undefined,
                            }))
                          }
                        >
                          Remove end date
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Description */}
            <div className="px-1 space-y-2">
              <Label htmlFor="description">
                Notes
                <span className="ml-1 text-muted-foreground">(optional)</span>
              </Label>

              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add any instructions or important notes..."
                maxLength={2000}
                rows={3}
              />
            </div>

            {/* Auto scheduling */}
            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <Label
                    htmlFor="auto-schedule"
                    className="text-sm font-medium"
                  >
                    Let Potter handle reminders
                  </Label>

                  <p className="text-sm text-muted-foreground">
                    Potter will schedule this care in Google Calendar and remind
                    you when it's time.
                  </p>
                </div>

                <Switch
                  id="auto-schedule"
                  checked={formData.autoSchedule}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, autoSchedule: checked }))
                  }
                  disabled={calendarConnection?.connected !== "connected"}
                />
              </div>
              <div className="flex justify-end">
                <ConnectGoogleCalendarButton
                  plantId={plantId}
                  status={calendarConnection?.connected}
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
