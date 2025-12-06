import { create } from "zustand";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (payload: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  }) => void;
  logout: () => void;
  initialize: () => void;
}

// Load auth from localStorage
const loadAuthFromStorage = (): Partial<AuthState> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userStr = localStorage.getItem("user");
    
    if (accessToken && refreshToken && userStr) {
      const user = JSON.parse(userStr);
      return { user, accessToken, refreshToken };
    }
  } catch (error) {
    console.error("Error loading auth from storage:", error);
  }
  return { user: null, accessToken: null, refreshToken: null };
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  setAuth: ({ user, accessToken, refreshToken }) => {
    // Save to localStorage
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, accessToken, refreshToken });
  },
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    set({ user: null, accessToken: null, refreshToken: null });
  },
  initialize: () => {
    const auth = loadAuthFromStorage();
    set(auth);
  }
}));