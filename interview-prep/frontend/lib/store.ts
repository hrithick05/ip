"use client";

import { create } from "zustand";

type User = { id: string; email: string; name: string };

type ActivityItem = {
  id: string;
  label: string;
  status: "success" | "warning" | "error";
  timestamp: string;
};

type AppState = {
  user: User | null;
  token: string | null;
  streakDays: number;
  activities: ActivityItem[];
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  addActivity: (item: ActivityItem) => void;
};

export const useAppStore = create<AppState>((set) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("auth_token") : null,
  streakDays: 7,
  activities: [
    { id: "1", label: "Solved Two Sum", status: "success", timestamp: "2h ago" },
    { id: "2", label: "Completed HR response", status: "warning", timestamp: "5h ago" },
    { id: "3", label: "Attempted System Design MCQ", status: "error", timestamp: "1d ago" }
  ],
  setAuth: (user, token) => {
    localStorage.setItem("auth_token", token);
    document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
    set({ user, token });
  },
  clearAuth: () => {
    localStorage.removeItem("auth_token");
    document.cookie = "auth_token=; path=/; max-age=0";
    set({ user: null, token: null });
  },
  addActivity: (item) =>
    set((state) => ({
      activities: [item, ...state.activities].slice(0, 5)
    }))
}));
