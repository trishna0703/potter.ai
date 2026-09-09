import type { Concern, ConcernStatus } from "../hooks/useGetConcerns";
import { S3_URL } from "#lib/routes";
import { formatRelativeDate } from "../utils/draft-concern-utils";

import {
  ArrowRightIcon,
  CalendarDotsIcon,
  ClockAfternoonIcon,
  DotsThreeVerticalIcon,
  HeartIcon,
  WarningDiamondIcon,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Badge } from "#components/ui/badge";
import { cn } from "#lib/utils";
import ViewConcernDetails from "../ViewConcernDetails";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#components/ui/dropdown-menu";

const getBadgeContent = (status: ConcernStatus) => {
  switch (status) {
    case "OPEN":
      return {
        styles: "bg-yellow-100 text-ochre/100",
        icon: <WarningDiamondIcon />,
        text: "Needs Attention",
      };
    case "COMPLETED":
      return {
        styles: "bg-secondary text-primary",
        icon: <HeartIcon />,
        text: "Resolved",
      };
    case "MONITORING":
      return {
        styles: "bg-info text-info-foreground",
        icon: <ClockAfternoonIcon />,
        text: "Monitoring",
      };
    default:
      return {
        styles: "",
        icon: <></>,
        text: "",
      };
  }
};
const ConcernCard = ({
  concern,
  handleReassessment,
  markResolved,
}: {
  concern: Concern;
  handleReassessment: (id: number) => void;
  markResolved: (id: number) => void;
}) => {
  const badge = getBadgeContent(concern.status);
  return (
    <div
      key={concern.id}
      className="flex sm:gap-4 border-[0.5px] rounded-3xl flex-col sm:flex-row p-2"
    >
      <div className="object-cover h-40 w-full sm:w-48 sm:h-52 rounded-2xl overflow-hidden relative sm:flex-1">
        <img
          src={S3_URL + "/" + concern.photo_url}
          alt=""
          className="size-full object-cover sm:rounded-l-xl rounded-t-xl rounded-b-none sm:rounded-r-none"
        />
        <Badge className={cn(badge.styles, "absolute top-2 left-2")}>
          {badge.icon}
          {badge.text}
        </Badge>
      </div>

      <div className="flex flex-col sm:h-full justify-start px-4 py-2 w-full sm:flex-2 space-y-4 sm:space-y-2">
        <div className="flex justify-between w-full items-start">
          <div>
            <h3 className="text-md font-semibold text-primary capitalize">
              {concern.title}
            </h3>
            <p className="text-xs text-muted-foreground ">
              {concern.name
                ? `${concern.name} (${concern.identified_species})`
                : concern.identified_species}
            </p>
          </div>
          <Menu
            markResolved={() => markResolved(concern.id)}
            handleReassessment={() => handleReassessment(concern.id)}
            showMarkResolved={concern.status === "MONITORING"}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {concern.initial_context.substring(0, 100) + "..."}
        </p>

        <p className="text-muted-foreground/70 text-xs flex gap-1 items-center">
          <CalendarDotsIcon size={14} />{" "}
          {formatRelativeDate(concern.reported_on)}
        </p>
        <div className="mt-auto">
          {concern.status === "COMPLETED" ? (
            <ViewConcernDetails assessmentId={concern.assessment_id} />
          ) : (
            <div className="space-y-2 flex flex-col">
              {concern.status === "MONITORING" ? (
                <div className="bg-info/10 rounded-xl p-2 flex flex-col gap-2">
                  <p className="text-xs text-muted-foreground/60">
                    Note: We have marked this concern as currently monitoring.
                    If this is resolved, please mark it resolved. If the issue
                    persists, you can re-open the concern from the menu.
                  </p>
                </div>
              ) : null}
              <Link
                to={`active/${concern.assessment_id}`}
                className="button-custom h-9! bg-accent/10! border-[0.5px] text-accent-foreground! font-medium! w-max ms-auto"
              >
                View details <ArrowRightIcon />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConcernCard;

const Menu = ({
  markResolved,
  showMarkResolved,
  handleReassessment,
}: {
  markResolved: () => void;
  showMarkResolved: boolean;
  handleReassessment: () => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={
          "bg-card rounded-full p-1.5 border-[0.5px] border-muted cursor-pointer"
        }
      >
        <DotsThreeVerticalIcon />{" "}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {showMarkResolved && (
          <DropdownMenuItem onClick={markResolved}>
            Mark Resolved
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleReassessment}>
          Re-open
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
