export interface AssessmentMessage {
  id: number;
  assessment_id: number;
  sequence: number;
  role: "assistant" | "user";
  message_type: "question" | "answer" | "assessment" | "error";
  payload: Record<string, unknown>;
  created_at: string;
  optimistic?: boolean;
}
