import { request } from "./client";

export function askQuestion(videoId, question) {
  return request(`/videos/${videoId}/chat`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export function getChatHistory(videoId) {
  return request(`/videos/${videoId}/chat`);
}
