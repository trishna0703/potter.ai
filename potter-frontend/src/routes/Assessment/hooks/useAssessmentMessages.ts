import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";
import useActiveMessages from "@/store/ActiveConnectionStore";
import type { AssessmentMessage } from "@/types/messages";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const useAssessmentMessages = (assessmentId: number) => {
  const { setMessages } = useActiveMessages();

  const query = useQuery({
    queryKey: ["assessment-messages", assessmentId],
    queryFn: async (): Promise<AssessmentMessage[]> =>
      await apiClient(API_ENDPOINTS.MESSAGES(assessmentId)),
    enabled: Boolean(assessmentId),
  });

  useEffect(() => {
    if (query.data) {
      setMessages(query.data);
    }
  }, [query.data, setMessages]);

  return query;
};

export default useAssessmentMessages;
