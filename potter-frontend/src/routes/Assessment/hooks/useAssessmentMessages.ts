import apiClient from "#lib/client";
import { API_ENDPOINTS } from "#lib/endpoints";
import useActiveMessages from "@/store/ActiveConnectionStore";
import type { AssessmentMessage } from "@/types/messages";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const useAssessmentMessages = (concernId: number) => {
  const { setMessages } = useActiveMessages();

  const query = useQuery({
    queryKey: ["assessment-messages", concernId],
    queryFn: async (): Promise<AssessmentMessage[]> =>
      await apiClient(API_ENDPOINTS.MESSAGES(concernId)),
    enabled: Boolean(concernId),
  });

  useEffect(() => {
    if (query.data) {
      setMessages(query.data);
    }
  }, [query.data, setMessages]);

  return query;
};

export default useAssessmentMessages;
