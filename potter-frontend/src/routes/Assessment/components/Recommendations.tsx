import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import useRecommendations from "../hooks/useRecommendations";
import type { RecommendationOption } from "@/types/recommendation";
import { LightbulbIcon, PlantIcon } from "@phosphor-icons/react";
import { Separator } from "#components/ui/separator";
import { Badge } from "#components/ui/badge";

interface RecommendationSectionProps {
  assessment_id: string | number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function RecommendationCard({
  recommendation,
  isMostRecommended,
}: {
  recommendation: RecommendationOption;
  isMostRecommended: boolean;
}) {
  return (
    <div className="rounded-lg border-[0.5px] p-4 space-y-3">
      <div>
        <div className="space-x-4 flex sm:items-center sm:flex-row flex-col-reverse w-full ">
          <h3 className="font-semibold text-playfair text-lg">
            {recommendation.title}
          </h3>
          {isMostRecommended ? (
            <Badge variant={"secondary"} className="italic">
              <PlantIcon /> Most common fix
            </Badge>
          ) : null}
        </div>

        <p className="text-sm text-muted-foreground">
          {recommendation.summary}
        </p>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-primary">Steps</h4>

        <ul className="space-y-3 text-sm">
          {recommendation.steps.map((step, index) => (
            <li key={index} className="flex gap-2">
              <span className="shrink-0 bg-secondary/40 text-primary size-6 text-xs rounded-full flex justify-center items-center">
                {index + 1}
              </span>
              <span className="flex-1 text-muted-foreground">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {recommendation.materials.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-primary">Materials</h4>

          <ul className="text-sm flex flex-wrap gap-4">
            {recommendation.materials.map((material) => (
              <li
                key={material}
                className="bg-info/10 text-info p-2 rounded-lg font-medium"
              >
                {material}
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendation.frequency && (
        <p className="text-sm text-muted-foreground">
          <span className="text-sm font-medium text-primary">Frequency:</span>{" "}
          {recommendation.frequency}
        </p>
      )}

      {recommendation.duration && (
        <p className="text-sm text-muted-foreground">
          <span className="text-sm font-medium text-primary">Duration:</span>{" "}
          {recommendation.duration}
        </p>
      )}

      {recommendation.caution && (
        <p className="text-sm text-warning bg-warning/20 p-3 rounded-lg">
          <span className="font-medium">Caution:</span> {recommendation.caution}
        </p>
      )}

      <div className="rounded-md bg-secondary/40 p-3 text-sm flex items-center gap-1.5">
        <img src="/bulb.png" alt="bulb-icon" className="size-14" />
        <Separator orientation="vertical" />
        <div className="flex flex-col ps-1.5">
          <span className="font-medium text-xs text-primary">
            Expected result{" "}
          </span>
          <p className="text-xs text-muted-foreground">
            {recommendation.expected_result}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Recommendations({
  assessment_id,
  open,
  onOpenChange,
}: RecommendationSectionProps) {
  const {
    data: recommendations,
    isLoading,
    isError,
  } = useRecommendations(Number(assessment_id));
  const noRecommendationsFound =
    !isLoading &&
    !isError &&
    recommendations?.type == "recommendation_options" &&
    recommendations.options.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className="cursor-pointer flex items-center justify-center gap-1 w-full max-w-48 text-sm bg-primary rounded-lg text-primary-foreground py-1.5 px-3">
        <LightbulbIcon /> Suggestions
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-w-full no-scrollbar max-h-dvh sm:max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={"text-playfair text-2xl font-bold"}>
            Suggested Treatments
          </DialogTitle>
          <DialogDescription className={"text-xs text-muted-foreground"}>
            Here are a few ways to help your plant get better. Follow the steps
            below and see what works best for your plant!
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-4 px-4">
          {isLoading && (
            <div className="py-8 text-center">Loading suggestions...</div>
          )}

          {isError && (
            <div className="py-8 text-center text-destructive">{isError}</div>
          )}

          {noRecommendationsFound && (
            <div className="py-8 text-center text-muted-foreground">
              No suggestions available.
            </div>
          )}

          {recommendations && recommendations.options.length > 0 && (
            <div className="space-y-4">
              {recommendations.options.map((recommendation, i) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  isMostRecommended={i === 0}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
