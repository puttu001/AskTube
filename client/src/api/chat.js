import { API_BASE_URL } from "../config/api";
import { request } from "./client";

export async function* streamAnswer(videoId, question) {
  const response = await fetch(`${API_BASE_URL}/videos/${videoId}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!response.ok || !response.body) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || response.statusText);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    yield decoder.decode(value, { stream: true });
  }
}

export function getChatHistory(videoId) {
  return request(`/videos/${videoId}/chat`);
}
