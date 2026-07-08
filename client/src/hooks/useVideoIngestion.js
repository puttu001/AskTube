import { useCallback, useEffect, useRef, useState } from "react";
import { getVideo, ingestVideo } from "../api/videos";

const POLL_INTERVAL_MS = 2000;

export function useVideoIngestion() {
  const [video, setVideo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pollRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  const pollStatus = useCallback(
    (videoId) => {
      stopPolling();
      pollRef.current = setInterval(async () => {
        try {
          const updated = await getVideo(videoId);
          setVideo(updated);
          if (updated.status === "ready" || updated.status === "failed") {
            stopPolling();
          }
        } catch {
          stopPolling();
        }
      }, POLL_INTERVAL_MS);
    },
    [stopPolling]
  );

  const loadVideo = useCallback(
    async (url) => {
      setIsSubmitting(true);
      try {
        const created = await ingestVideo(url);
        setVideo(created);
        if (created.status !== "ready") {
          pollStatus(created.video_id);
        }
        return created;
      } finally {
        setIsSubmitting(false);
      }
    },
    [pollStatus]
  );

  const setActiveVideo = useCallback(
    (videoData) => {
      stopPolling();
      setVideo(videoData);
    },
    [stopPolling]
  );

  const reset = useCallback(() => {
    stopPolling();
    setVideo(null);
  }, [stopPolling]);

  return { video, isSubmitting, loadVideo, setActiveVideo, reset };
}
