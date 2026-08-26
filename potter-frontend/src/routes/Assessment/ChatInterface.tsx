import { ScrollArea } from "@/components/ui/scroll-area";

import useActiveMessages from "@/store/ActiveConnectionStore";
import type { AssessmentMessage } from "@/types/messages";

import AssessmentMessageList from "./components/AssessmentMessageList";
import LatestMessageSection from "./LatestMessageSection";
import useAssessmentConnection from "./hooks/useAssessmentConnection";
import AssessmentSkeleton from "./components/AssessmentSkeleton";
import useAssessmentMessages from "./hooks/useAssessmentMessages";
import { useParams, useNavigate } from "react-router-dom";
import useRaiseConcern from "../HealthConcerns/hooks/useRaiseConcern";
import { ROUTES } from "#lib/routes";
import { showErrorToast } from "#lib/utils";
import { Button } from "#components/ui/button";
import Recommendations from "./components/Recommendations";

const ChatInterface = () => {
  const params = useParams();
  const navigate = useNavigate();

  const assessmentId = params.assessment_id;

  const { messages, latestMessage, interactionState } = useActiveMessages();

  const { isLoading, isError } = useAssessmentMessages(Number(assessmentId));

  const { sendMessage } = useAssessmentConnection();

  const { reassess } = useRaiseConcern();

  const handleReassessment = async () => {
    try {
      const result = await reassess({ concern_id: Number(assessmentId) });
      navigate(`${ROUTES.CONCERNSACTIVE}/${result.assessment_id}`);
    } catch (error) {
      console.error("Reassessment failed:", error);
      showErrorToast(error);
    }
  };

  const historyMessages: AssessmentMessage[] =
    latestMessage?.type === "question"
      ? messages.filter(
          (message) => message.id !== latestMessage.interaction_id,
        )
      : messages;

  if (interactionState === "connecting" || isLoading) {
    return <AssessmentSkeleton />;
  }

  if (isError) {
    return <div>Something went wrong. Refresh the page.</div>;
  }

  return (
    <div className="flex flex-col relative h-[calc(100vh-7rem)]">
      {/* Conversation history */}
      <ScrollArea className="flex-1">
        <AssessmentMessageList messages={historyMessages} />
      </ScrollArea>

      {messages.length === 0 && interactionState === "waiting_for_ai" && (
        <div className="py-8 text-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <img src="/loading.svg" />
          <p className="text-lg text-primary">Your assessment has started.</p>
          <p className="text-sm text-muted-foreground">
            Please wait while we analyse the issue.
          </p>
        </div>
      )}

      {/* Current interaction */}
      <div className="shrink-0 bg-background">
        <div className="mx-auto w-full max-w-3xl px-4 py-6">
          <LatestMessageSection sendMessage={sendMessage} />
        </div>
      </div>

      {/* Recommendations */}
      <Recommendations />
      <div className="flex justify-end gap-4 items-center">
        <span className="font-semibold text-muted-foreground text-sm">
          Not satisfied with the result?
        </span>
        <Button onClick={handleReassessment} variant={"outline"}>
          Request Reassessment
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
