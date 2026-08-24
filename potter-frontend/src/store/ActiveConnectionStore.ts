import type {
  AnswerValue,
  AssessmentServerMessage,
  AssessmentUIStatus,
  QuestionServerMessage,
} from "@/types/assessment";
import type { AssessmentMessage } from "@/types/messages";
import { create } from "zustand";

interface ActiveMessageState {
  interactionState: AssessmentUIStatus | null;
  messages: AssessmentMessage[];
  latestMessage: AssessmentServerMessage | null;
  setLatestMessage: (message: AssessmentServerMessage | null) => void;
  setInteractionState: (status: AssessmentUIStatus | null) => void;
  setMessages: (messages: AssessmentMessage[]) => void;
  appendQuestion: (message: QuestionServerMessage) => void;
  appendUserAnswer: (interactionId: number, value: AnswerValue) => void;
}

const useActiveMessages = create<ActiveMessageState>()((set) => ({
  messages: [],
  interactionState: null,
  latestMessage: null,
  setLatestMessage: (message) => set({ latestMessage: message }),
  setInteractionState: (status) => set({ interactionState: status }),
  setMessages: (messages) => set({ messages }),
  appendUserAnswer: (interactionId, value) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: -Date.now(),
          assessment_id: 0,
          sequence:
            Math.max(0, ...state.messages.map((message) => message.sequence)) +
            1,
          role: "user",
          message_type: "answer",
          payload: {
            interaction_id: interactionId,
            value,
          },
          created_at: new Date().toISOString(),
        },
      ],
    })),
  appendQuestion: (message) =>
    set((state) => {
      // Never add the same interaction twice.
      const alreadyExists = state.messages.some(
        (item) => item.id === message.interaction_id,
      );

      if (alreadyExists) {
        return state;
      }

      const nextSequence =
        Math.max(0, ...state.messages.map((item) => item.sequence)) + 1;

      return {
        messages: [
          ...state.messages,
          {
            id: message.interaction_id,
            assessment_id: 0,
            sequence: nextSequence,
            role: "assistant",
            message_type: "question",
            payload: message.payload,
            created_at: new Date().toISOString(),
            optimistic: true,
          },
        ],
      };
    }),
}));

export default useActiveMessages;
