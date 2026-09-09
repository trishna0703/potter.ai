import { useState } from "react";
import { Recommendations } from "../Assessment/components/Recommendations";
import AssessmentDialog from "../Assessment/components/AssessmentDialog";


const ViewConcernDetails = ({ assessmentId }: { assessmentId: number }) => {
  const [showAssessment, setShowAssessment] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);

  return (
    <div className="flex gap-4">
      <Recommendations
        assessment_id={assessmentId}
        open={showRecommendation}
        onOpenChange={setShowRecommendation}
      />
      <AssessmentDialog
        id={assessmentId}
        open={showAssessment}
        onOpenChange={setShowAssessment}
      />
    </div>
  );
};

export default ViewConcernDetails;
