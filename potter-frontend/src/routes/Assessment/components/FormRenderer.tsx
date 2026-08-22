import type { AnswerValue, QuestionServerMessage } from "@/types/assessment";
import SelectHandler from "./SelectHandler";
import InputHandler from "./InputHandler";

const FormRenderer = ({
  latestMessage,
  onSubmit,
}: {
  latestMessage: QuestionServerMessage;
  onSubmit: (value: AnswerValue) => void;
}) => {
  const type = latestMessage?.payload.input_type;

  switch (type) {
    case "boolean":
    case "multiple_choice":
    case "single_choice":
      return (
        <SelectHandler payload={latestMessage.payload} onSubmit={onSubmit} />
      );
    case "number":
    case "text":
      return (
        <InputHandler payload={latestMessage.payload} onSubmit={onSubmit} />
      );

    default:
      return null;
  }
};

export default FormRenderer;
