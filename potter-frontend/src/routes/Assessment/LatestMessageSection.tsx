import Overlay from "#components/layout/Overlay";

import useActiveMessages from "@/store/ActiveConnectionStore";

import type {
  AnswerValue,
  AssessmentUIStatus,
  QuestionServerMessage,
} from "@/types/assessment";
import FormRenderer from "./components/FormRenderer";
import AssessmentView from "./components/AssessmentView";
import AssessmentError from "./components/AssessmentErrorView";

const QuestionAnswerView = ({
  latestMessage,
  interactionState,
  sendMessage,
}: {
  latestMessage: QuestionServerMessage;
  interactionState: AssessmentUIStatus | null;
  sendMessage: (id: number, value: AnswerValue) => void;
}) => {
  const onSubmit = (value: AnswerValue) => {
    sendMessage(latestMessage.interaction_id, value);
  };

  return interactionState == "waiting_for_user" ? (
    <FormRenderer onSubmit={onSubmit} latestMessage={latestMessage} />
  ) : (
    <div>Thinking...</div>
  );
};

// -----------------------------Latest message View -------------------------------
const LatestMessageSection = ({
  sendMessage,
}: {
  sendMessage: (id: number, value: AnswerValue) => void;
}) => {
  const { latestMessage, interactionState } = useActiveMessages();

  if (interactionState == "connecting") {
    return <Overlay />;
  }

  if (!latestMessage) return null;

  switch (latestMessage.type) {
    case "question":
      return (
        <QuestionAnswerView
          {...{ sendMessage, latestMessage, interactionState }}
        />
      );
    case "assessment":
      return <AssessmentView {...{ latestMessage }} />;
    case "error":
      return <AssessmentError error={latestMessage.payload} />;
    default:
      return null;
  }
};

export default LatestMessageSection;
