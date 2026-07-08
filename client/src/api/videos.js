import { request } from "./client";

export function ingestVideo(url) {
  return request("/videos", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}

export function getVideo(videoId) {
  return request(`/videos/${videoId}`);
}

export function listVideos() {
  return request("/videos");
}
