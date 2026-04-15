"use client";

export function useApi() {
  function apiFetch(path: string, options: RequestInit = {}) {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      }
    }).then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Request failed");
      }
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("application/pdf")) return res.blob();
      return res.json();
    });
  }

  return { apiFetch };
}
