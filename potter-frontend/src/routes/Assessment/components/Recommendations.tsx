// components/recommendations/RecommendationSection.tsx

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import useRecommendations from "../hooks/useRecommendations";
import type { RecommendationOption } from "@/types/recommendation";

interface RecommendationSectionProps {
  assessment_id: string | number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function RecommendationCard({
  recommendation,
}: {
  recommendation: RecommendationOption;
}) {
  return (
    <div className="rounded-lg border-[0.5px] p-4 space-y-3">
      <div>
        <h3 className="font-semibold">{recommendation.title}</h3>

        <p className="text-sm text-muted-foreground">
          {recommendation.summary}
        </p>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium">Steps</h4>

        <ol className="list-decimal space-y-2 pl-5 text-sm">
          {recommendation.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>

      {recommendation.materials.length > 0 && (
        <div>
          <h4 className="text-sm font-medium">Materials</h4>

          <ul className="list-disc pl-5 text-sm">
            {recommendation.materials.map((material) => (
              <li key={material}>{material}</li>
            ))}
          </ul>
        </div>
      )}

      {recommendation.frequency && (
        <p className="text-sm">
          <span className="font-medium">Frequency:</span>{" "}
          {recommendation.frequency}
        </p>
      )}

      {recommendation.duration && (
        <p className="text-sm">
          <span className="font-medium">Duration:</span>{" "}
          {recommendation.duration}
        </p>
      )}

      {recommendation.caution && (
        <p className="text-sm text-destructive">
          <span className="font-medium">Caution:</span> {recommendation.caution}
        </p>
      )}

      <div className="rounded-md bg-muted p-3 text-sm">
        <span className="font-medium">Expected result: </span>
        {recommendation.expected_result}
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
      <DialogTrigger className="cursor-pointer w-full max-w-48 text-sm bg-primary rounded-lg text-primary-foreground py-1.5 px-3">
        Recommendations
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Recommended Treatments</DialogTitle>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[70vh] overflow-y-auto px-4">
          {isLoading && (
            <div className="py-8 text-center">Loading recommendations...</div>
          )}

          {isError && (
            <div className="py-8 text-center text-destructive">{isError}</div>
          )}

          {noRecommendationsFound && (
            <div className="py-8 text-center text-muted-foreground">
              No recommendations available.
            </div>
          )}

          {recommendations && recommendations.options.length > 0 && (
            <div className="space-y-4">
              {recommendations.options.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
