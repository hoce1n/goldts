import { MeResponse } from "@/types/auth.types";
import { create } from "zustand";

type AuthState = {
    accessToken: string | null;
    user: MeResponse | null;
    hydrated: boolean;
    setAccessToken: (token: string | null) => void;
    setUser: (user: MeResponse | null) => void;
    setHydrated: () => void;
    clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    user: null,
    hydrated: false,

    setAccessToken: (token) => set({ accessToken: token }),
    setUser: (user) => set({ user }),
    setHydrated: () => set({ hydrated: true }),
    clearAuth: () => set({ user: null, accessToken: null, hydrated: false }),
}));