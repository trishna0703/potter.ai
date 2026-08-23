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
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Conversation history */}
      <ScrollArea className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-4 py-8">
          <AssessmentMessageList messages={historyMessages} />
        </div>
      </ScrollArea>

      {messages.length === 0 && interactionState === "waiting_for_ai" && (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Your assessment has started.
          </p>
        </div>
      )}

      {/* Current interaction */}
      <div className="shrink-0 border-t bg-background">
        <div className="mx-auto w-full max-w-3xl px-4 py-6">
          <LatestMessageSection sendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
