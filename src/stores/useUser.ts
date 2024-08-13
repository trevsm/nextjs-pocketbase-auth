import { PublicUser } from "@/types";
import { create } from "zustand";

interface UseUserStore {
  user: PublicUser | null;
  setUser: (user: PublicUser) => void;
}

export const useUser = create<UseUserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
