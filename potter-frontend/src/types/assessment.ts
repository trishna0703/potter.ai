export type AssessmentConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export type AssessmentServerMessageType = "question" | "assessment" | "error";

export type AssessmentClientMessageType = "answer";

export interface QuestionOption {
  value: string;
  label: string;
}

export type InputType =
  | "single_choice"
  | "multiple_choice"
  | "text"
  | "number"
  | "boolean";

type BaseQuestionPayload = {
  id: string;
  prompt: string;
  required: boolean;
};

export type SingleChoiceQuestion = BaseQuestionPayload & {
  input_type: "single_choice";
  options: QuestionOption[];
};

export type MultipleChoiceQuestion = BaseQuestionPayload & {
  input_type: "multiple_choice";
  options: QuestionOption[];
};

export type BooleanQuestion = BaseQuestionPayload & {
  input_type: "boolean";
  options: QuestionOption[];
};

export type TextQuestion = BaseQuestionPayload & {
  input_type: "text";
};

export type NumberQuestion = BaseQuestionPayload & {
  input_type: "number";
};

export type QuestionPayload =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | BooleanQuestion
  | TextQuestion
  | NumberQuestion;

export interface QuestionServerMessage {
  type: "question";
  interaction_id: number;
  payload: QuestionPayload;
}

export interface AIAssessment {
  problem: string;
  problem_cause: string;
  confidence: string;
  explanation: string;
}

export interface AssessmentResultServerMessage {
  type: "assessment";
  interaction_id: number;
  payload: AIAssessment;
}

export interface AssessmentErrorPayload {
  code: string;
  message: string;
}

export interface ErrorServerMessage {
  type: "error";
  payload: AssessmentErrorPayload;
}

export type AssessmentServerMessage =
  | QuestionServerMessage
  | AssessmentResultServerMessage
  | ErrorServerMessage;

export type AnswerValue = string | string[] | number | boolean;

export interface AnswerPayload {
  value: AnswerValue;
}

export interface AnswerClientMessage {
  type: "answer";
  interaction_id: number;
  payload: AnswerPayload;
}

export type AssessmentClientMessage = AnswerClientMessage;

export type AssessmentUIStatus =
  | "connecting"
  | "waiting_for_ai"
  | "waiting_for_user"
  | "error"
  | "disconnected";

export interface AssessmentState {
  connectionStatus: AssessmentConnectionStatus;
  uiStatus: AssessmentUIStatus;
  currentInteraction: QuestionServerMessage | null;
  assessment: AssessmentResultServerMessage | null;
  error: AssessmentErrorPayload | null;
}

type AnswerForQuestion<T extends QuestionPayload> =
  T extends SingleChoiceQuestion
    ? string
    : T extends MultipleChoiceQuestion
      ? string[]
      : T extends BooleanQuestion
        ? boolean
        : T extends TextQuestion
          ? string
          : T extends NumberQuestion
            ? number
            : never;

export type QuestionHandlerProps<T extends QuestionPayload> = {
  payload: T;
  onSubmit: (value: AnswerForQuestion<T>) => void;
};
