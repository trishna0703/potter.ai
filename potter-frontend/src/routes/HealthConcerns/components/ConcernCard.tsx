import type { Concern, ConcernStatus } from "../hooks/useGetConcerns";
import { S3_URL } from "#lib/routes";
import { formatRelativeDate } from "../utils/draft-concern-utils";

import {
  ArrowRightIcon,
  CalendarDotsIcon,
  HeartIcon,
  WarningDiamondIcon,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Badge } from "#components/ui/badge";
import { cn } from "#lib/utils";

const getBadgeContent = (status: ConcernStatus) => {
  switch (status) {
    case "OPEN":
      return {
        styles: "bg-destructive text-ochre",
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
        styles: "bg-info text-ochre",
        icon: <HeartIcon />,
        text: "Monitoring",
      };
  }
};
const ConcernCard = ({ concern }: { concern: Concern }) => {
  const badge = getBadgeContent(concern.status);
  return (
    <div
      key={concern.id}
      className="flex sm:gap-4 border-[0.5px] rounded-3xl flex-col sm:flex-row p-2"
    >
      <div className="object-cover h-40 w-full sm:size-48 rounded-2xl overflow-hidden relative sm:flex-1">
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

      <div className="flex gap-4 lg:flex-row flex-col p-4 w-full sm:flex-2">
        <div className="flex flex-col h-full w-full justify-between">
          <div>
            <h3 className="text-md font-semibold text-primary">
              {concern.title}
            </h3>
            <p className="text-xs pb-2 text-muted-foreground ">
              {concern.name
                ? `${concern.name} (${concern.identified_species})`
                : concern.identified_species}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            {concern.initial_context.substring(0, 100) + "..."}
          </p>
          <div className="flex justify-between items-center w-full">
            <p className="text-primary/50 text-xs flex gap-1 items-center">
              <CalendarDotsIcon size={14} />{" "}
              {formatRelativeDate(concern.reported_on)}
            </p>

            <Link
              to={`view`}
              className="button-custom bg-accent! text-accent-foreground! font-medium!"
            >
              View details <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcernCard;
