import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { AssessmentWebSocket } from "../utils/assessment_websocket";
import useActiveMessages from "@/store/ActiveConnectionStore";
import type { AnswerValue, AssessmentServerMessage } from "@/types/assessment";

export default function useAssessmentConnection() {
  const { assessment_id } = useParams<{ assessment_id: string }>();

  const concernId = Number(assessment_id);

  const {
    latestMessage,
    setLatestMessage,
    setInteractionState,
    appendUserAnswer,
    appendQuestion,
  } = useActiveMessages();

  const assessmentSocketRef = useRef<AssessmentWebSocket | null>(null);

  useEffect(() => {
    if (!concernId || Number.isNaN(concernId)) {
      return;
    }

    const assessmentSocket = new AssessmentWebSocket();

    assessmentSocketRef.current = assessmentSocket;

    setInteractionState("connecting");

    assessmentSocket.connect(
      concernId,

      (message) => {
        console.log("Server message:", message);

        if (message.type === "error") {
          console.error("Assessment error:", message);
          return;
        }

        setLatestMessage(message);
        if (message.type === "assessment") {
          setInteractionState("disconnected");
          return;
        }
        setInteractionState("waiting_for_user");
      },

      () => {
        console.log("WebSocket connected");
        setInteractionState("waiting_for_ai");
      },

      () => {
        setInteractionState("disconnected");

        console.log("WebSocket disconnected");
      },

      () => {
        setInteractionState("error");

        console.log("WebSocket error");
      },
    );

    return () => {
      assessmentSocket.disconnect();

      assessmentSocketRef.current = null;

      setInteractionState(null);
    };
  }, [concernId, setLatestMessage]);

  const sendMessage = (interactionId: number, value: AnswerValue) => {
    const socket = assessmentSocketRef.current;

    if (!socket) {
      throw new Error("Assessment WebSocket is not initialized.");
    }

    if (!latestMessage || latestMessage.type !== "question") {
      return;
    }

    appendQuestion(latestMessage);

    appendUserAnswer(interactionId, value);

    setLatestMessage(null);

    setInteractionState("waiting_for_ai");

    socket.sendAnswer(interactionId, value);
  };

  return {
    sendMessage,
  };
}
