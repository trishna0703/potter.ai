import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "#components/ui/dialog";
import AssessmentView from "./AssessmentView";
import useAssessment from "../hooks/useAssessment";
import type { AIAssessment } from "@/types/assessment";

interface AssessmentDialogProps {
  id: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AssessmentDialog = ({
  id,
  open,
  onOpenChange,
}: AssessmentDialogProps) => {
  const assessment = useAssessment(id);

  let assessmentObj: AIAssessment | null = assessment
    ? {
        confidence: assessment.confidence,
        explanation: assessment.explanation,
        problem: assessment.problem,
        problem_cause: assessment.problem_cause,
      }
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className="cursor-pointer w-full max-w-48 text-sm bg-card rounded-lg border-[0.5px] py-1.5 px-3">
        Diagnosis
      </DialogTrigger>
      <DialogContent className={"sm:max-w-4xl w-full max-h-[70vh]"}>
        <DialogTitle>Diagnosis</DialogTitle>

        {assessmentObj ? (
          <AssessmentView
            latestMessage={assessmentObj}
            id={id}
            isNested
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentDialog;
