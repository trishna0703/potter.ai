import { useState } from "react";
import {
    CalendarDays,
    Clock3,
    GlassWaterIcon,
    Leaf,
    LeafyGreenIcon,
    Loader,
    Pencil,
    RefreshCw,
    Save,
    Scissors,
    SunDim,
    Trash2,
    X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { CareSchedule, UpdateScheduleType } from "@/types/care_events";
import { cn } from "#lib/utils";
import WarningDialog from "#components/utils/WarningDialog";

interface CareScheduleCardProps {
    schedule: CareSchedule;
    onUpdate: (scheduleId: number, payload: UpdateScheduleType) => Promise<void>;
    onDelete: (scheduleId: number) => Promise<void>;
}

const timezoneOptions = [
    "Asia/Kolkata",
    "UTC",
    "Europe/London",
    "America/New_York",
    "America/Los_Angeles",
];

const getIconAndStyles = (type: string) => {

    switch (type) {
        case "WATER": return {
            icon: <GlassWaterIcon className="size-4 sm:size-8" />,
            styles: "bg-blue-50 text-blue-600"
        }
        case "FERTILIZER":
        case "COMPOST":
            return {
                icon: <Leaf className="size-4 sm:size-8" />,
                styles: "bg-green-50 text-green-600"
            }
        case "PRUNING": return {
            icon: <Scissors className="size-4 sm:size-8" />,
            styles: "bg-ochre/10 text-ochre"
        }
        case "REPOT": return {
            icon: <LeafyGreenIcon className="size-4 sm:size-8" />,
            styles: "bg-terracotta/10 text-terracotta"
        }
        case "SUNBATHING": return {
            icon: <SunDim className="size-4 sm:size-8" />,
            styles: "bg-yellow-50 text-yellow-600"
        }
    }
}

function formatFrequency(schedule: CareSchedule) {
    const unit = schedule.frequency_type === "DAYS" ? "day" : "week";

    return `Every ${schedule.interval} ${unit}${schedule.interval > 1 ? "s" : ""
        }`;
}

function formatTime(value: string) {
    const [hours, minutes] = value.split(":").map(Number);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
}

function formatDate(value: string) {
    return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function CareScheduleCard({
    schedule,
    onUpdate,
    onDelete,
}: CareScheduleCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [toggleFor, setToggleFor] = useState<"is_active" | "auto-schedule">();
    const [showWarning, setShowWarning] = useState(false);

    const [description, setDescription] = useState(schedule.description ?? "");

    const [frequencyType, setFrequencyType] = useState<
        CareSchedule["frequency_type"]
    >(schedule.frequency_type);

    const [interval, setInterval] = useState(String(schedule.interval));

    const [scheduledTime, setScheduledTime] = useState(
        schedule.scheduled_time.slice(0, 5),
    );

    const [timezone, setTimezone] = useState(schedule.timezone);

    const startEditing = () => {
        setDescription(schedule.description ?? "");
        setFrequencyType(schedule.frequency_type);
        setInterval(String(schedule.interval));
        setScheduledTime(schedule.scheduled_time.slice(0, 5));
        setTimezone(schedule.timezone);

        setIsEditing(true);
    };

    const cancelEditing = () => {
        setDescription(schedule.description ?? "");
        setFrequencyType(schedule.frequency_type);
        setInterval(String(schedule.interval));
        setScheduledTime(schedule.scheduled_time.slice(0, 5));
        setTimezone(schedule.timezone);

        setIsEditing(false);
    };

    const handleSave = async () => {
        setIsSaving(true);

        try {
            await onUpdate(schedule.id, {
                description: description || null,
                frequency_type: frequencyType,
                interval: Number(interval),
                scheduled_time: scheduledTime,
                timezone,
            });

            setIsEditing(false);
        } finally {
            setIsSaving(false);
        }
    };

    let icon = getIconAndStyles(schedule.care_type)
    return (
        <article className="rounded-2xl border bg-card p-5 shadow-sm flex gap-4 justify-between items-center">
            <div className="flex justify-between gap-4 w-3/5 items-start lg:items-center flex-col lg:flex-row">
                <div className="flex sm:items-center gap-4 w-full lg:w-3/5">
                    <div className={cn("hidden sm:flex size-10 sm:size-20 shrink-0 items-center justify-center rounded-full", icon?.styles)}>
                        {icon?.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex gap-2 flex-col">
                                <div className="flex gap-2 items-center">
                                    <div className="flex sm:hidden size-10 sm:size-20 shrink-0 items-center justify-center rounded-full bg-secondary/50 text-green-700">
                                        <GlassWaterIcon className="size-4 sm:size-8" />
                                    </div>
                                    <h3 className="text-md font-semibold capitalize">
                                        {schedule.care_type.toLocaleLowerCase()}
                                    </h3>
                                </div>
                                {isEditing ? (
                                    <Input
                                        className="text-xs"
                                        value={description}
                                        onChange={(event) => setDescription(event.target.value)}
                                        placeholder="Update your notes..."
                                    />
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        {schedule.description ||
                                            "Keep your plant happy and healthy."}
                                    </p>
                                )}

                                <Badge
                                    className={cn(
                                        "mt-1",
                                        schedule.is_active
                                            ? "text-green-700 bg-secondary/30"
                                            : "text-muted-foreground bg-muted",
                                    )}
                                >
                                    <Clock3 className="size-2" />
                                    {schedule.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col h-full gap-2 justify-center w-full lg:w-2/5">
                    <div className="flex gap-2 items-center">
                        {!isEditing && <RefreshCw className="size-3" />}

                        {isEditing ? (
                            <div className="flex gap-2 w-full">
                                <Input
                                    type="number"
                                    min={1}
                                    value={interval}
                                    onChange={(event) => setInterval(event.target.value)}
                                    className="w-1/2 text-xs"
                                />

                                <Select
                                    value={frequencyType}
                                    onValueChange={(value) =>
                                        setFrequencyType(value as CareSchedule["frequency_type"])
                                    }
                                >
                                    <SelectTrigger className="text-xs w-1/2">
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="DAYS">Days</SelectItem>
                                        <SelectItem value="WEEKS">Weeks</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <p className="text-xs font-semibold">{formatFrequency(schedule)}</p>
                        )}
                    </div>

                    <div className="flex gap-2 items-center">
                        {!isEditing && <Clock3 className="size-3" />}

                        {isEditing ? (
                            <div className="flex gap-2 w-full">
                                <Input
                                    type="time"
                                    className="w-1/2 text-xs"
                                    value={scheduledTime}
                                    onChange={(event) => setScheduledTime(event.target.value)}
                                />

                                <Select
                                    value={timezone}
                                    onValueChange={(value) => setTimezone(value as string)}
                                >
                                    <SelectTrigger className={"w-1/2 text-xs"}>
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {timezoneOptions.map((value) => (
                                            <SelectItem key={value} value={value}>
                                                {value}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <p className="text-xs">{formatTime(schedule.scheduled_time)}</p>
                        )}
                    </div>

                    {!isEditing && (
                        <div className="flex gap-2 items-center text-muted-foreground">
                            <CalendarDays className="size-3" />
                            <p className="text-xs">
                                Started on {formatDate(schedule.starts_on)}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex h-full justify-between w-2/5 items-end lg:items-center flex-col-reverse lg:flex-row">
                <div className="flex flex-col gap-3 lg:w-1/2">
                    <div className="flex items-center w-full gap-3">
                        <Switch
                            checked={Boolean(schedule.auto_schedule)}
                            onCheckedChange={async (checked) => {
                                setToggleFor("auto-schedule");
                                await onUpdate(schedule.id, {
                                    auto_schedule: checked,
                                });
                                setToggleFor(undefined);
                            }}
                            className={"cursor-pointer"}
                        />

                        <span className="text-xs">Add to Calendar</span>

                        {toggleFor === "auto-schedule" && (
                            <Loader className="size-3! loader" />
                        )}
                    </div>
                    <div className="flex items-center w-full gap-3">
                        <Switch
                            checked={schedule.is_active}
                            onCheckedChange={async (checked) => {
                                setToggleFor("is_active");
                                await onUpdate(schedule.id, {
                                    is_active: checked,
                                    auto_schedule: false,
                                });
                                setToggleFor(undefined);
                            }}
                            className={"cursor-pointer"}
                        />

                        <span className="text-xs">Active</span>
                        {toggleFor === "is_active" && <Loader className="size-3! loader" />}
                    </div>
                </div>

                <div className="flex justify-center lg:h-full items-center w-1/2">
                    {isEditing ? (
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                size={"icon"}
                                onClick={cancelEditing}
                                disabled={isSaving}
                            >
                                <X className="size-4" />
                            </Button>

                            <Button onClick={handleSave} disabled={isSaving} size={"icon"}>
                                {isSaving ? (
                                    <Loader className="loader size-4" />
                                ) : (
                                    <Save className="size-4" />
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <Button variant="outline" size="icon" onClick={startEditing}>
                                <Pencil className="size-4" />
                            </Button>

                            <WarningDialog
                                open={showWarning}
                                onCancel={setShowWarning}
                                onContinue={() => {
                                    onDelete(schedule.id);
                                    setShowWarning(false);
                                }}
                            >
                                <span className="cursor-pointer size-8 bg-destructive/10 text-destructive border-[0.5px] border-destructive/40 flex items-center justify-center rounded-lg">
                                    <Trash2 className="size-4" />
                                </span>
                            </WarningDialog>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
