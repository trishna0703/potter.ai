import { useEffect } from "react";
import useUserStore from "../../store/UserStore";
import { API_ENDPOINTS } from "#lib/endpoints";

export default function useAuth() {
  const { setUser } = useUserStore();

  async function getCurrentUser() {
    let res = await fetch(API_ENDPOINTS.USER, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to auto sign in with Google");
    }

    return await res.json();
  }

  useEffect(() => {
    getCurrentUser().then((user) => {
      setUser(user);
    });
  }, []);

  async function SignInWithGoogle(token: string) {
    let res = await fetch(API_ENDPOINTS.LOGIN, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ token }),
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to sign in with Google");
    }

    let data = await res.json();

    return data;
  }

  return { SignInWithGoogle };
}
