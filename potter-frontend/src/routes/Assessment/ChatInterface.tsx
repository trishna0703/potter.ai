import { ScrollArea } from "@/components/ui/scroll-area";

import useActiveMessages from "@/store/ActiveConnectionStore";
import type { AssessmentMessage } from "@/types/messages";

import AssessmentMessageList from "./components/AssessmentMessageList";
import LatestMessageSection from "./LatestMessageSection";
import useAssessmentConnection from "./hooks/useAssessmentConnection";
import AssessmentSkeleton from "./components/AssessmentSkeleton";
import useAssessmentMessages from "./hooks/useAssessmentMessages";
import { useParams } from "react-router-dom";

const ChatInterface = () => {
  const params = useParams();

  const assessmentId = params.assessment_id;

  const { messages, latestMessage, interactionState } = useActiveMessages();

  const { isLoading, isError } = useAssessmentMessages(Number(assessmentId));

  const { sendMessage } = useAssessmentConnection();

  if (!assessmentId) return null;

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
          <LatestMessageSection
            sendMessage={sendMessage}
            assessment_id={Number(assessmentId)}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
