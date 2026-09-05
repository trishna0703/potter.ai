import { Badge } from "#components/ui/badge";
import { formatLabel } from "#lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { AIAssessment } from "@/types/assessment";
import { InfoIcon } from "lucide-react";
import { Recommendations } from "./Recommendations";
import { useState } from "react";
import { Button } from "#components/ui/button";
import useRaiseConcern from "@/routes/HealthConcerns/hooks/useRaiseConcern";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "#lib/routes";

type AssessmentViewProps = {
  id: number;
  latestMessage: AIAssessment;
  isNested?: boolean;
};

const getConfidenceVariant = (
  confidence: string,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (confidence.toLowerCase()) {
    case "high":
      return "default";

    case "moderate":
    case "medium":
      return "secondary";

    case "low":
      return "outline";

    default:
      return "outline";
  }
};

const AssessmentView = ({
  latestMessage,
  id,
  isNested,
}: AssessmentViewProps) => {
  const { problem, problem_cause, confidence, explanation } = latestMessage;
  const [openRecommendations, setOpenRecommendations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { reassess } = useRaiseConcern();
  const navigate = useNavigate();

  const handleReassessment = async () => {
    setIsLoading(true);
    try {
      const result = await reassess({ concern_id: Number(id) });
      navigate(`${ROUTES.CONCERNSACTIVE}/${result.assessment_id}`);
    } catch (error) {
      console.error("Reassessment failed:", error);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge
              variant={getConfidenceVariant(confidence)}
              className="capitalize"
            >
              {confidence} confidence
            </Badge>
            <CardTitle className="mt-1 text-2xl">
              {formatLabel(problem)}
            </CardTitle>
          </div>

          {!isNested ? (
            <Recommendations
              assessment_id={Number(id)}
              open={openRecommendations}
              onOpenChange={setOpenRecommendations}
            />
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <section className="space-y-2">
          <h3 className="font-medium">Likely cause</h3>

          <p className="text-muted-foreground">{formatLabel(problem_cause)}</p>
        </section>

        <section className="space-y-2">
          <h3 className="font-medium">What we found</h3>

          <p className="leading-7 text-muted-foreground">{explanation}</p>
        </section>

        <div className="rounded-lg bg-muted/50 p-4 flex gap-2">
          <InfoIcon className="size-5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            This assessment is based on the information and evidence provided
            during this investigation. If you are not satisfied, you can request
            a reassessment.
          </p>
          <Button
            disabled={isLoading}
            onClick={handleReassessment}
            variant={"outline"}
          >
            Request Reassessment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentView;
