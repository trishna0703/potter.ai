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
  sendMessage: (id: number, value: AnswerValue, label: string | null) => void;
}) => {
  const onSubmit = (value: AnswerValue, label: string | null) => {
    sendMessage(latestMessage.interaction_id, value, label);
  };

  return interactionState == "waiting_for_user" ? (
    <FormRenderer onSubmit={onSubmit} latestMessage={latestMessage} />
  ) : null;
};

// -----------------------------Latest message View -------------------------------
const LatestMessageSection = ({
  sendMessage,
  assessment_id,
}: {
  sendMessage: (id: number, value: AnswerValue, label: string | null) => void;
  assessment_id: number;
}) => {
  const { latestMessage, interactionState } = useActiveMessages();

  if (!latestMessage) return null;

  switch (latestMessage.type) {
    case "question":
      return (
        <QuestionAnswerView
          {...{ sendMessage, latestMessage, interactionState }}
        />
      );
    case "assessment":
      return (
        <AssessmentView
          latestMessage={latestMessage.payload}
          id={assessment_id}
        />
      );
    case "error":
      return <AssessmentError error={latestMessage.payload} />;
    default:
      return null;
  }
};

export default LatestMessageSection;
