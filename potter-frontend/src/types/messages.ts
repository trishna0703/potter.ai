import type {
  AIAssessment,
  AnswerValue,
  QuestionPayload,
} from "@/types/assessment";

interface AssessmentMessageBase {
  id: number;
  assessment_id: number;
  sequence: number;
  created_at: string;
  optimistic?: boolean;
}

export interface AnswerMessage extends AssessmentMessageBase {
  role: "user";
  message_type: "answer";
  payload: {
    interaction_id: number;
    value: AnswerValue;
    label: string | null;
  };
}

export interface QuestionMessage extends AssessmentMessageBase {
  role: "assistant";
  message_type: "question";
  payload: QuestionPayload;
}

export interface AssessmentResultMessage extends AssessmentMessageBase {
  role: "assistant";
  message_type: "assessment";
  payload: AIAssessment;
}

export interface ErrorMessage extends AssessmentMessageBase {
  role: "assistant";
  message_type: "error";
  payload: Record<string, unknown>;
}

export type AssessmentMessage =
  | AnswerMessage
  | QuestionMessage
  | AssessmentResultMessage
  | ErrorMessage;
