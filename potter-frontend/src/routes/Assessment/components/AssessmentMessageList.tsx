import useActiveMessages from "@/store/ActiveConnectionStore";
import type { AssessmentMessage } from "@/types/messages";

type AssessmentMessageListProps = {
  messages: AssessmentMessage[];
};

const getQuestionText = (message: AssessmentMessage) => {
  if (
    message.message_type === "question" &&
    typeof message.payload === "object" &&
    message.payload !== null &&
    "prompt" in message.payload &&
    typeof message.payload.prompt === "string"
  ) {
    return message.payload.prompt;
  }

  return null;
};

const getAnswerText = (message: AssessmentMessage) => {
  if (
    message.message_type === "answer" &&
    typeof message.payload === "object" &&
    message.payload !== null &&
    "value" in message.payload
  ) {
    const value = message.payload.value;
    const label = message.payload.label;

    if (label && typeof label === "string") {
      return label;
    }

    if (Array.isArray(value)) {
      return value.join(", ");
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    return String(value);
  }

  return null;
};

const AssessmentMessageList = ({ messages }: AssessmentMessageListProps) => {
  const { interactionState } = useActiveMessages();
  const sortedMessages = messages
    .slice()
    .sort((a, b) => a.sequence - b.sequence);

  if (sortedMessages.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 min-h-0 ">
      <div className="flex flex-col gap-5">
        {sortedMessages.map((message) => {
          const isAssistant = message.role === "assistant";
    
          const content =
            message.message_type === "question"
              ? getQuestionText(message)
              : message.message_type === "answer"
                ? getAnswerText(message)
                : null;

          if (!content) {
            return null;
          }

          return (
            <div
              key={message.id}
              className={[
                "flex w-full",
                isAssistant ? "justify-start" : "justify-end",
              ].join(" ")}
            >
              <div
                className={[
                  "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
                  isAssistant
                    ? "rounded-bl-md border bg-card"
                    : "rounded-br-md bg-primary text-primary-foreground",
                ].join(" ")}
              >
                <div
                  className={[
                    "mb-1.5 text-xs font-medium",
                    isAssistant
                      ? "text-muted-foreground"
                      : "text-primary-foreground/70",
                  ].join(" ")}
                >
                  {isAssistant ? "Potter.ai" : "You"}
                </div>

                <p className="whitespace-pre-wrap text-sm leading-6">
                  {content}
                </p>
              </div>
            </div>
          );
        })}
        {interactionState === "waiting_for_ai" ? (
          <div className="flex items-center">
            <img src="/thinking.svg" className="w-15" alt="" />
            <span className="text-muted-foreground text-sm">Analysing...</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AssessmentMessageList;
