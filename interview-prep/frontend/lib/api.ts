"use client";

import { useAuth } from "@clerk/nextjs";

export function useApi() {
  const { getToken } = useAuth();

  async function apiFetch(path: string, options: RequestInit = {}) {
    const token = await getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Request failed");
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/pdf")) {
      return response.blob();
    }

    return response.json();
  }

  return { apiFetch };
}
