import { API_ENDPOINTS } from "#lib/endpoints";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "#lib/client";
import { useEffect } from "react";
import useUserStore from "@/store/UserStore";

export default function useAuth() {
  const client = useQueryClient();
  const { setUser } = useUserStore();

  async function getCurrentUser() {
    return await apiClient(API_ENDPOINTS.USER, {
      method: "GET",
    });
  }

  const currentUser = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => await getCurrentUser(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (currentUser.data) {
      console.log("triggered and populated user");
      setUser(currentUser.data);
    }
  }, [currentUser.data]);

  async function SignInWithGoogle(token: string) {
    let userData = await apiClient(API_ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    setUser(userData);

    client.setQueryData(["currentUser"], userData);

    return userData;
  }

  const clearCurrentUser = () => {
    client.removeQueries({
      queryKey: ["currentUser"],
    });

    setUser(null);
  };

  return { SignInWithGoogle, currentUser, clearCurrentUser };
}

export function useLogout() {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      return await apiClient(API_ENDPOINTS.LOGOUT, { method: "POST" });
    },
  });
}
