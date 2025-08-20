import type { LoggedInUser } from "@/features/user/interfaces/user.interface";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UserStore extends LoggedInUser {
    login(user: any): void;
    logout(): void;
    updateUser(user: any): void;
    isInitialized(): boolean;
}

const initialValues: UserStore = {
    isLoggedIn: false,
    user_uuid: null,
    role: null,
    username: "",
    token: null,
    expires_in: null,
    verified: false,
    enabled: false,
    login: () => { },
    logout: () => { },
    updateUser: () => { },
    isInitialized: () => false,
};

const STORE_KEY = "auth";

export const useAuthStore = create<UserStore>()(
    devtools(
        persist(
            (set) => ({
                ...initialValues,
                login: (user: LoggedInUser) => {
                    set((state) => ({
                        ...state,
                        ...user,
                    }));
                },
                logout: () => {
                    set(initialValues);
                    localStorage.removeItem(STORE_KEY);
                    window.location.href = "/auth/sign-in";
                },
                updateUser: async (user: Partial<LoggedInUser>) => {
                    set((state) => ({ ...state, ...user }));
                },
                isInitialized: () => {
                    return true; // Always consider initialized for simpler logic
                },
            }),
            {
                name: STORE_KEY,
            }
        )
    )
);

export const getAuthStoreState = () => useAuthStore.getState();