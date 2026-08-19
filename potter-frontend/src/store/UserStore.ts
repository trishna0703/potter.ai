import { create } from "zustand";

export interface UserType {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

interface UserState {
  user: UserType | null;
  setUser: (user: UserType) => void;
}

const useUserStore = create<UserState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useUserStore;
