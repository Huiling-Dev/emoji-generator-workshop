// Browser-side helpers for talking to the Bun API.
import type { Category, GeneratedEmoji, NewEmoji, SavedEmoji } from "./emojis";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  } catch {
    throw new Error("Can't reach the server. Check that bun dev is still running.");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed with status ${res.status}`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const api = {
  health: () => request<{ ok: boolean; storage: "memory" | "postgres" }>("/api/health"),

  generate: (category: Category, count: number) =>
    request<GeneratedEmoji[]>(`/api/generate?category=${category}&count=${count}`),

  listSaved: () => request<SavedEmoji[]>("/api/emojis"),

  save: (input: NewEmoji) =>
    request<SavedEmoji>("/api/emojis", { method: "POST", body: JSON.stringify(input) }),

  remove: (id: number) => request<void>(`/api/emojis/${id}`, { method: "DELETE" }),
};
