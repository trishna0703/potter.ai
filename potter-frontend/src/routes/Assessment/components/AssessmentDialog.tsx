import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#components/ui/dialog";
import AssessmentView from "./AssessmentView";
import useAssessment from "../hooks/useAssessment";
import type { AIAssessment } from "@/types/assessment";
import { StethoscopeIcon } from "@phosphor-icons/react";
import { Separator } from "#components/ui/separator";

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
      <DialogTrigger className="cursor-pointer w-full max-w-48 flex gap-1 justify-center items-center text-sm bg-card rounded-lg border-[0.5px] py-1.5 px-3">
        <StethoscopeIcon /> Diagnosis
      </DialogTrigger>
      <DialogContent
        className={
          "sm:max-w-4xl max-w-full max-h-dvh sm:max-h-[80dvh] overflow-y-auto gap-0 no-scrollbar"
        }
      >
        <DialogHeader className="px-4 pb-2">
          <DialogTitle className={"text-playfair text-2xl font-bold"}>
            Diagnosis
          </DialogTitle>
          <DialogDescription className={"text-xs text-muted-foreground"}>
            Based on your plant's symptoms
          </DialogDescription>
        </DialogHeader>
        <Separator className={"h-[0.1px]!"} />
        {assessmentObj ? (
          <AssessmentView latestMessage={assessmentObj} id={id} isNested />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentDialog;
