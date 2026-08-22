import { API_ENDPOINTS } from "#lib/endpoints";
import type {
  AnswerClientMessage,
  AnswerValue,
  AssessmentServerMessage,
} from "@/types/assessment";

export class AssessmentWebSocket {
  private socket: WebSocket | null = null;

  connect(
    concernId: number,
    onMessage: (message: AssessmentServerMessage) => void,
    onOpen?: () => void,
    onClose?: () => void,
    onError?: () => void,
  ) {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

    const url = `${protocol}//` + `${API_ENDPOINTS.ASSESSMENT_WS}/${concernId}`;

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      onOpen?.();
    };

    this.socket.onmessage = (event) => {
      const message: AssessmentServerMessage = JSON.parse(event.data);

      onMessage(message);
    };

    this.socket.onerror = () => {
      onError?.();
    };

    this.socket.onclose = () => {
      onClose?.();
      this.socket = null;
    };
  }

  sendAnswer(interactionId: number, value: AnswerValue) {
    if (!this.socket) {
      throw new Error("WebSocket is not connected.");
    }

    if (this.socket.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not open.");
    }

    const message: AnswerClientMessage = {
      type: "answer",
      interaction_id: interactionId,
      payload: {
        value,
      },
    };

    this.socket.send(JSON.stringify(message));
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }
}
