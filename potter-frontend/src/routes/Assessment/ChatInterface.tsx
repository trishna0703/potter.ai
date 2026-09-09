import { ScrollArea } from "@/components/ui/scroll-area";

import useActiveMessages from "@/store/ActiveConnectionStore";
import type { AssessmentMessage } from "@/types/messages";

import AssessmentMessageList from "./components/AssessmentMessageList";
import LatestMessageSection from "./LatestMessageSection";
import useAssessmentConnection from "./hooks/useAssessmentConnection";
import AssessmentSkeleton from "./components/AssessmentSkeleton";
import useAssessmentMessages from "./hooks/useAssessmentMessages";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const ChatInterface = () => {
  const params = useParams();

  const assessmentId = params.assessment_id;

  const { messages, latestMessage, interactionState } = useActiveMessages();

  const { isLoading, isError } = useAssessmentMessages(Number(assessmentId));

  const { sendMessage } = useAssessmentConnection();

  useEffect(() => {
    if (latestMessage) {
      document.getElementById("latest-message")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [latestMessage]);
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
    <div className="flex flex-col relative h-[calc(100vh - 4rem)]">
      {/* Conversation history */}
      <ScrollArea className="flex-1 max-h-max">
        <AssessmentMessageList messages={historyMessages} />
      </ScrollArea>

      {/* Current interaction */}
      {latestMessage ? (
        <div className="shrink-0 bg-card rounded-2xl" id="latest-message">
          <div className="mx-auto w-full max-w-3xl px-4 py-6">
            <LatestMessageSection
              sendMessage={sendMessage}
              assessment_id={Number(assessmentId)}
            />
          </div>
        </div>
      ) : null}

      
    </div>
  );
};

export default ChatInterface;
