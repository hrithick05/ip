"use client";

import { create } from "zustand";

type ActivityItem = {
  id: string;
  label: string;
  status: "success" | "warning" | "error";
  timestamp: string;
};

type AppState = {
  streakDays: number;
  activities: ActivityItem[];
  addActivity: (item: ActivityItem) => void;
};

export const useAppStore = create<AppState>((set) => ({
  streakDays: 7,
  activities: [
    { id: "1", label: "Solved Two Sum", status: "success", timestamp: "2h ago" },
    { id: "2", label: "Completed HR response", status: "warning", timestamp: "5h ago" },
    { id: "3", label: "Attempted System Design MCQ", status: "error", timestamp: "1d ago" }
  ],
  addActivity: (item) =>
    set((state) => ({
      activities: [item, ...state.activities].slice(0, 5)
    }))
}));
