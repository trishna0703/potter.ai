import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { AssessmentErrorPayload } from "@/types/assessment";

type AssessmentErrorProps = {
  error: AssessmentErrorPayload;
};

const AssessmentError = ({ error }: AssessmentErrorProps) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />

      <AlertTitle>Something went wrong</AlertTitle>

      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
};

export default AssessmentError;
