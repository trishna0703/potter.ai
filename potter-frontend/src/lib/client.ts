import { showErrorToast } from "./utils";

const apiClient = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    showErrorToast(error?.detail || "Something went wrong");
    throw new Error(error?.detail || "Something went wrong");
  }

  return await response.json();
};

export default apiClient;
